"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useCallback, useMemo, useRef } from "react";

const STORAGE_KEY = "property61_tenancy_v1";
const MAX_SUB_TENANTS = 2;
const SIGNATURE_HEIGHT = 160;
const LEAD_TENANT_NAME = "David Martin";
const MANAGING_AGENT = "Milard’s Property Management";
const NOTICE_PERIOD = "28 days";

interface SignatureData {
  dataUrl: string | null;
  timestamp: string | null;
}

interface SubTenantDetails {
  name: string;
  address: string;
}

interface FormState {
  agreeDate: string;
  startDate: string;
  rent: string;
  rentDay: string;
  witnessName: string;
}

interface SignaturesState {
  tenant: SignatureData;
  witness: SignatureData;
  subTenants: SignatureData[];
}

interface FormErrors {
  agreeDate?: string;
  startDate?: string;
  rent?: string;
  subTenants?: { name?: string; address?: string }[];
}

interface PersistedState {
  form: FormState;
  subTenants: SubTenantDetails[];
  signatures: SignaturesState;
}

const createDefaultForm = (): FormState => {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  return {
    agreeDate: today.toISOString().slice(0, 10),
    startDate: nextWeek.toISOString().slice(0, 10),
    rent: "750",
    rentDay: "14",
    witnessName: "",
  };
};

const defaultSubTenants = (): SubTenantDetails[] => [{ name: "", address: "" }];

const createDefaultSignature = (): SignatureData => ({ dataUrl: null, timestamp: null });

const sanitizeForm = (raw?: Partial<FormState>): Partial<FormState> => {
  if (!raw) return {};
  const next: Partial<FormState> = {};
  if (typeof raw.agreeDate === "string") next.agreeDate = raw.agreeDate;
  if (typeof raw.startDate === "string") next.startDate = raw.startDate;
  if (typeof raw.rent === "string" || typeof raw.rent === "number") {
    next.rent = String(raw.rent);
  }
  if (typeof raw.rentDay === "string" || typeof raw.rentDay === "number") {
    next.rentDay = String(raw.rentDay);
  }
  if (typeof raw.witnessName === "string") next.witnessName = raw.witnessName;
  return next;
};

const sanitizeSubTenant = (raw: unknown): SubTenantDetails => {
  if (!raw || typeof raw !== "object") {
    return { name: "", address: "" };
  }
  const value = raw as { name?: unknown; address?: unknown };
  return {
    name: typeof value.name === "string" ? value.name : "",
    address: typeof value.address === "string" ? value.address : "",
  };
};

const sanitizeSignature = (raw: unknown): SignatureData | null => {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as { dataUrl?: unknown; timestamp?: unknown };
  return {
    dataUrl: typeof value.dataUrl === "string" ? value.dataUrl : null,
    timestamp: typeof value.timestamp === "string" ? value.timestamp : null,
  };
};

const ensureSignatureLength = (
  length: number,
  existing?: unknown,
): SignatureData[] => {
  const source = Array.isArray(existing) ? existing : [];
  const result: SignatureData[] = [];
  for (let i = 0; i < length; i += 1) {
    const entry = source[i];
    if (entry && typeof entry === "object") {
      const item = entry as { dataUrl?: unknown; timestamp?: unknown };
      result.push({
        dataUrl: typeof item.dataUrl === "string" ? item.dataUrl : null,
        timestamp: typeof item.timestamp === "string" ? item.timestamp : null,
      });
    } else {
      result.push(createDefaultSignature());
    }
  }
  return result;
};

const formatUkDate = (value: string | null | undefined, fallback: string): string => {
  if (!value) return fallback;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return fallback;
  return parsed.toLocaleDateString("en-GB", { timeZone: "Europe/London" });
};

const formatUkTimestamp = (): string =>
  new Date().toLocaleString("en-GB", { timeZone: "Europe/London", hour12: false });

const signatureStampText = (signature: SignatureData): string =>
  signature.timestamp ? `${signature.timestamp} (UK)` : "[Signature and UK timestamp]";

const drawSignatureImage = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  dataUrl: string | null,
) => {
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = rect.width || canvas.width / ratio;
  if (!width) return;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, SIGNATURE_HEIGHT);
  if (!dataUrl) return;
  const image = new Image();
  image.onload = () => {
    ctx.clearRect(0, 0, width, SIGNATURE_HEIGHT);
    ctx.drawImage(image, 0, 0, width, SIGNATURE_HEIGHT);
  };
  image.src = dataUrl;
};

interface SignaturePadProps {
  id: string;
  label: string;
  ariaLabel: string;
  uploadAriaLabel: string;
  value: SignatureData;
  onChange: (value: SignatureData) => void;
}

function SignaturePad({ id, label, ariaLabel, uploadAriaLabel, value, onChange }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const latestValueRef = useRef<SignatureData>(value);
  const changeRef = useRef(onChange);

  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  useEffect(() => {
    changeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.style.touchAction = "none";

    let observer: ResizeObserver | null = null;
    let frameId: number | null = null;
    let drawing = false;
    let wrote = false;
    let lastPoint = { x: 0, y: 0 };
    let activePointer: number | null = null;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const parentWidth =
        (canvas.parentElement?.clientWidth ?? canvas.getBoundingClientRect().width) ?? 600;
      canvas.width = Math.floor(parentWidth * ratio);
      canvas.height = Math.floor(SIGNATURE_HEIGHT * ratio);
      canvas.style.width = `${parentWidth}px`;
      canvas.style.height = `${SIGNATURE_HEIGHT}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#111";
      ctx.clearRect(0, 0, parentWidth, SIGNATURE_HEIGHT);
      drawSignatureImage(canvas, ctx, latestValueRef.current.dataUrl);
    };

    const getPoint = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const finishStroke = () => {
      if (!drawing) return;
      drawing = false;
      if (activePointer !== null) {
        try {
          canvas.releasePointerCapture(activePointer);
        } catch {
          // ignore failures
        }
      }
      activePointer = null;
      if (wrote) {
        const dataUrl = canvas.toDataURL("image/png");
        changeRef.current({ dataUrl, timestamp: latestValueRef.current.timestamp });
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      event.preventDefault();
      drawing = true;
      wrote = false;
      activePointer = event.pointerId;
      try {
        canvas.setPointerCapture(activePointer);
      } catch {
        // ignore failures
      }
      lastPoint = getPoint(event);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!drawing) return;
      event.preventDefault();
      const point = getPoint(event);
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      lastPoint = point;
      wrote = true;
    };

    const handlePointerUp = () => {
      finishStroke();
      wrote = false;
    };

    resize();
    observer = new ResizeObserver(() => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(resize);
    });
    observer.observe(canvas);

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);
    canvas.addEventListener("pointerleave", handlePointerUp);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      observer?.disconnect();
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
      canvas.removeEventListener("pointerleave", handlePointerUp);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawSignatureImage(canvas, ctx, value.dataUrl);
  }, [value.dataUrl]);

  const handleClear = () => {
    if (latestValueRef.current.dataUrl) {
      const confirmed = window.confirm("Clear this signature?");
      if (!confirmed) return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      drawSignatureImage(canvas, ctx, null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    changeRef.current({ dataUrl: null, timestamp: null });
  };

  const handleStamp = () => {
    changeRef.current({
      dataUrl: latestValueRef.current.dataUrl,
      timestamp: formatUkTimestamp(),
    });
  };

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      changeRef.current({
        dataUrl: reader.result,
        timestamp: latestValueRef.current.timestamp,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <div className="sig-pad">
        <canvas id={id} ref={canvasRef} aria-label={ariaLabel} />
      </div>
      <div className="sig-tools">
        <button className="btn" type="button" onClick={handleClear}>
          Clear
        </button>
        <button className="btn" type="button" onClick={handleStamp}>
          Stamp time
        </button>
        <span className="hint" aria-live="polite">
          {value.timestamp ? `Signed ${value.timestamp} (UK)` : "No timestamp yet"}
        </span>
      </div>
      <div className="upload">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          aria-label={uploadAriaLabel}
          onChange={handleUpload}
        />
        <span className="hint">Upload PNG or JPG</span>
      </div>
    </div>
  );
}

export default function AgreementPage() {
  const [form, setForm] = useState<FormState>(() => createDefaultForm());
  const [subTenants, setSubTenants] = useState<SubTenantDetails[]>(() => defaultSubTenants());
  const [signatures, setSignatures] = useState<SignaturesState>(() => ({
    tenant: createDefaultSignature(),
    witness: createDefaultSignature(),
    subTenants: ensureSignatureLength(1),
  }));
  const [errors, setErrors] = useState<FormErrors>({});
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [hydrated, setHydrated] = useState(false);
  const previewRef = useRef<HTMLElement | null>(null);
  const indicatorTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    document.title = "Sub-Tenancy Agreement — Flat 1, 61 Caledonian Crescent";
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      setHydrated(true);
      return;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistedState>;
        const sanitizedForm = sanitizeForm(parsed.form);
        if (Object.keys(sanitizedForm).length > 0) {
          setForm((prev) => ({ ...prev, ...sanitizedForm }));
        }

        const loadedSubs =
          parsed.subTenants && Array.isArray(parsed.subTenants) && parsed.subTenants.length
            ? parsed.subTenants.slice(0, MAX_SUB_TENANTS).map(sanitizeSubTenant)
            : defaultSubTenants();
        setSubTenants(loadedSubs);

        const rawSignatures = parsed.signatures;
        setSignatures({
          tenant: sanitizeSignature(rawSignatures?.tenant) ?? createDefaultSignature(),
          witness: sanitizeSignature(rawSignatures?.witness) ?? createDefaultSignature(),
          subTenants: ensureSignatureLength(
            loadedSubs.length,
            rawSignatures?.subTenants,
          ),
        });
      }
    } catch (error) {
      console.error("Failed to load saved agreement", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    setSignatures((prev) => {
      if (prev.subTenants.length === subTenants.length) {
        return prev;
      }
      return {
        ...prev,
        subTenants: ensureSignatureLength(subTenants.length, prev.subTenants),
      };
    });
  }, [subTenants.length]);

  useEffect(() => {
    return () => {
      if (indicatorTimeoutRef.current) {
        window.clearTimeout(indicatorTimeoutRef.current);
      }
    };
  }, []);

  const persistable = useMemo(
    () => ({
      form,
      subTenants,
      signatures,
    }),
    [form, signatures, subTenants],
  );

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    setSaveStatus("saving");
    const handle = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
        setSaveStatus("saved");
      } catch (error) {
        console.error("Failed to save agreement", error);
        setSaveStatus("error");
      }
      if (indicatorTimeoutRef.current) {
        window.clearTimeout(indicatorTimeoutRef.current);
      }
      indicatorTimeoutRef.current = window.setTimeout(() => {
        setSaveStatus("idle");
      }, 1200);
    }, 300);

    return () => {
      window.clearTimeout(handle);
    };
  }, [hydrated, persistable]);

  const clearFormError = useCallback((field: keyof FormState) => {
    setErrors((prev) => {
      if (prev[field] === undefined) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleFormChange = useCallback(
    (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value } = event.target;
      setForm((prev) => ({ ...prev, [field]: value }));
      clearFormError(field);
    },
    [clearFormError],
  );

  const handleSubTenantChange = useCallback(
    (index: number, field: keyof SubTenantDetails) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = event.target;
        setSubTenants((prev) =>
          prev.map((sub, i) => (i === index ? { ...sub, [field]: value } : sub)),
        );
        setErrors((prev) => {
          if (!prev.subTenants || !prev.subTenants[index]) return prev;
          const nextSubErrors = prev.subTenants.map((item, i) => {
            if (i !== index) return item;
            const clone = { ...item };
            delete clone[field];
            return clone;
          });
          const hasErrors = nextSubErrors.some((item) => item?.name || item?.address);
          if (!hasErrors) {
            const next = { ...prev };
            delete next.subTenants;
            return next;
          }
          return { ...prev, subTenants: nextSubErrors };
        });
      },
    [],
  );

  const validate = useCallback((): boolean => {
    const nextErrors: FormErrors = {};
    if (!form.agreeDate) {
      nextErrors.agreeDate = "Please provide the agreement date.";
    }
    if (!form.startDate) {
      nextErrors.startDate = "Please provide a start date.";
    }
    const rentValue = Number(form.rent);
    if (!Number.isFinite(rentValue) || rentValue < 1) {
      nextErrors.rent = "Rent must be at least £1.";
    }
    const subErrors = subTenants.map(() => ({ name: undefined, address: undefined }));
    if (!subTenants[0]?.name.trim()) {
      subErrors[0].name = "Please enter the sub-tenant’s full name.";
    }
    if (!subTenants[0]?.address.trim()) {
      subErrors[0].address = "Please enter the sub-tenant’s address.";
    }
    const hasSubErrors = subErrors.some((item) => item.name || item.address);
    if (hasSubErrors) {
      nextErrors.subTenants = subErrors;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [form, subTenants]);

  const handleGenerate = () => {
    if (!validate()) return;
    if (previewRef.current) {
      window.scrollTo({ top: previewRef.current.offsetTop - 8, behavior: "smooth" });
    }
  };

  const handleAddSubTenant = () => {
    if (subTenants.length >= MAX_SUB_TENANTS) {
      window.alert("You can add up to two sub-tenants.");
      return;
    }
    setSubTenants((prev) => [...prev, { name: "", address: "" }]);
  };

  const handleRemoveSubTenant = () => {
    if (subTenants.length <= 1) {
      window.alert("At least one sub-tenant is required.");
      return;
    }
    setSubTenants((prev) => prev.slice(0, -1));
  };

  const handleEmail = () => {
    const names = subTenants
      .map((sub, index) => sub.name.trim() || `Sub-Tenant ${index + 1}`)
      .join(" & ");
    const subject = encodeURIComponent(`Sub-Tenancy Agreement — ${names}`);
    const body = encodeURIComponent(
      `Hi David,\n\nThe sub-tenancy agreement is completed for ${names}.\nStart Date: ${
        form.startDate || "[date]"
      }\nMonthly Rent: £${form.rent || "750"}\nDue Day: ${form.rentDay || "14"}\n\nI’ve attached the PDF (or will send it next).\n\nThanks.`,
    );
    window.location.href = `mailto:david.martin.1296@gmail.com?subject=${subject}&body=${body}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearForm = () => {
    const confirmed = window.confirm(
      "Clear all form fields (signatures are kept unless you clear them individually)?",
    );
    if (!confirmed) return;
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error("Failed to clear saved agreement", error);
      }
    }
    setForm(createDefaultForm());
    setSubTenants(defaultSubTenants());
    setErrors({});
    setSignatures((prev) => ({
      tenant: prev.tenant,
      witness: prev.witness,
      subTenants: [prev.subTenants[0] ?? createDefaultSignature()],
    }));
  };

  const handleResetSignatures = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all signatures? This cannot be undone.",
    );
    if (!confirmed) return;
    setSignatures({
      tenant: createDefaultSignature(),
      witness: createDefaultSignature(),
      subTenants: ensureSignatureLength(subTenants.length),
    });
    window.alert("All signatures have been cleared.");
  };

  const updateTenantSignature = useCallback((value: SignatureData) => {
    setSignatures((prev) => ({ ...prev, tenant: value }));
  }, []);

  const updateWitnessSignature = useCallback((value: SignatureData) => {
    setSignatures((prev) => ({ ...prev, witness: value }));
  }, []);

  const updateSubSignature = useCallback((index: number, value: SignatureData) => {
    setSignatures((prev) => {
      const nextSubs = prev.subTenants.slice();
      nextSubs[index] = value;
      return { ...prev, subTenants: nextSubs };
    });
  }, []);

  const rentValue = Number(form.rent);
  const rentValid = Number.isFinite(rentValue) && rentValue >= 1;
  const displayRent = rentValid ? rentValue.toString() : "[Rent]";
  const displayInitTotal = rentValid ? (rentValue * 2).toString() : "[Total]";
  const displayRentDay = form.rentDay || "[day]";
  const displayAgreeDate = formatUkDate(form.agreeDate, "[Date]");
  const displayStartDate = formatUkDate(form.startDate, "[Start Date]");
  const witnessDisplay = form.witnessName.trim() || "[Witness]";
  const hasCoSubTenant = subTenants.length > 1;
  const saveMessage =
    saveStatus === "saving"
      ? "Saving…"
      : saveStatus === "saved"
        ? "Saved"
        : saveStatus === "error"
          ? "Save failed"
          : "";
  const indicatorState =
    saveStatus === "saved" ? "saved" : saveStatus === "error" ? "error" : undefined;

  return (
    <>
      <main>
        <div className="container">
          <header className="header" role="banner">
            <div style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
              <div>
                <h1>Sub-Tenancy Agreement</h1>
                <p className="subtitle">
                  Property: Flat 1, 61 Caledonian Crescent, Edinburgh • Lead tenant/occupier: {LEAD_TENANT_NAME}
                  {' '}• Managing agent: {MANAGING_AGENT}
                </p>
              </div>
              <span className="save-indicator" data-state={indicatorState} aria-live="polite">
                {saveMessage}
              </span>
            </div>
          </header>

          <div className="banner tip" role="note">
            💡 Tip: Use “Export as PDF” and choose “Save as PDF” in your print dialog. Then click “Email
            David” to open a prefilled email.
          </div>

          <div className="grid" aria-label="Form sections">
            <section className="card">
              <h2>Parties and Tenancy Details</h2>
              <div className="hr" />

              <div className="row">
                <div>
                  <label htmlFor="agreeDate" className="required">
                    Date of Agreement
                  </label>
                  <input
                    id="agreeDate"
                    type="date"
                    aria-required="true"
                    value={form.agreeDate}
                    onChange={handleFormChange("agreeDate")}
                    aria-invalid={errors.agreeDate ? "true" : undefined}
                  />
                  {errors.agreeDate ? (
                    <div className="error" role="alert">
                      {errors.agreeDate}
                    </div>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="startDate" className="required">
                    Start Date
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    aria-required="true"
                    value={form.startDate}
                    onChange={handleFormChange("startDate")}
                    aria-invalid={errors.startDate ? "true" : undefined}
                  />
                  {errors.startDate ? (
                    <div className="error" role="alert">
                      {errors.startDate}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="row">
                <div>
                  <label htmlFor="tenantName">Lead Tenant (fixed)</label>
                  <input id="tenantName" type="text" value={LEAD_TENANT_NAME} readOnly aria-readonly="true" />
                  <span className="hint">This cannot be changed.</span>
                </div>
                <div>
                  <label htmlFor="agent">Managing Agent (fixed)</label>
                  <input id="agent" type="text" value={MANAGING_AGENT} readOnly aria-readonly="true" />
                </div>
              </div>

              <div className="sub-header">
                <h3>Sub-Tenant(s)</h3>
                <div>
                  <button className="btn ghost" type="button" onClick={handleAddSubTenant}>
                    Add sub-tenant
                  </button>
                  <button className="btn ghost" type="button" onClick={handleRemoveSubTenant}>
                    Remove last
                  </button>
                </div>
              </div>
              <span className="hint">
                You can have one or two people. The first sub-tenant is required; the second is optional.
              </span>

              {subTenants.map((subTenant, index) => {
                const subError = errors.subTenants?.[index];
                return (
                  <div className="sub-card" key={`sub-tenant-${index}`}>
                    <h4>
                      Sub-Tenant {index + 1} {index === 0 ? "(required)" : "(optional)"}
                    </h4>
                    <label htmlFor={`subName-${index}`} className={index === 0 ? "required" : undefined}>
                      Full Name
                    </label>
                    <input
                      id={`subName-${index}`}
                      type="text"
                      placeholder="Full legal name"
                      value={subTenant.name}
                      onChange={handleSubTenantChange(index, "name")}
                      aria-required={index === 0 ? "true" : undefined}
                      aria-invalid={subError?.name ? "true" : undefined}
                    />
                    {subError?.name ? (
                      <div className="error" role="alert">
                        {subError.name}
                      </div>
                    ) : null}

                    <label htmlFor={`subAddr-${index}`} className={index === 0 ? "required" : undefined}>
                      Current Address
                    </label>
                    <textarea
                      id={`subAddr-${index}`}
                      placeholder="Address"
                      value={subTenant.address}
                      onChange={handleSubTenantChange(index, "address")}
                      aria-required={index === 0 ? "true" : undefined}
                      aria-invalid={subError?.address ? "true" : undefined}
                    />
                    {subError?.address ? (
                      <div className="error" role="alert">
                        {subError.address}
                      </div>
                    ) : null}
                  </div>
                );
              })}

              <div className="row" style={{ marginTop: "8px" }}>
                <div>
                  <label htmlFor="rent" className="required">
                    Monthly Rent (£)
                  </label>
                  <input
                    id="rent"
                    type="number"
                    min="0"
                    step="1"
                    value={form.rent}
                    onChange={handleFormChange("rent")}
                    aria-required="true"
                    aria-invalid={errors.rent ? "true" : undefined}
                  />
                  {errors.rent ? (
                    <div className="error" role="alert">
                      {errors.rent}
                    </div>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="rentDay" className="required">
                    Rent Due Day
                  </label>
                  <select
                    id="rentDay"
                    aria-required="true"
                    value={form.rentDay}
                    onChange={handleFormChange("rentDay")}
                  >
                    {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day.toString()}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="toolbar">
                <button className="btn primary" type="button" onClick={handleGenerate}>
                  Generate Agreement
                </button>
                <button className="btn" type="button" onClick={handleEmail}>
                  Email David
                </button>
                <button className="btn" type="button" onClick={handleClearForm}>
                  Clear Form
                </button>
                <button className="btn" type="button" onClick={handleResetSignatures}>
                  Reset Signatures
                </button>
              </div>
            </section>

            <section className="card">
              <h2>Signatures</h2>
              <div className="hr" />
              <p className="hint">
                Each sub-tenant gets their own signature pad. Draw slowly for quality or upload a PNG/JPG.
                Use “Stamp time” to add a UK timestamp.
              </p>

              {subTenants.map((_, index) => (
                <div key={`sig-${index}`}>
                  <SignaturePad
                    id={`sigSub-${index}`}
                    label={`Sub-Tenant ${index + 1} Signature`}
                    ariaLabel={`Signature pad for Sub-Tenant ${index + 1}`}
                    uploadAriaLabel={`Upload signature for Sub-Tenant ${index + 1}`}
                    value={signatures.subTenants[index] ?? createDefaultSignature()}
                    onChange={(value) => updateSubSignature(index, value)}
                  />
                  {index < subTenants.length - 1 ? <div className="hr" /> : null}
                </div>
              ))}

              <div className="hr" />

              <SignaturePad
                id="sigTenant"
                label={`Lead Tenant Signature (${LEAD_TENANT_NAME})`}
                ariaLabel={`Signature pad for Lead Tenant, ${LEAD_TENANT_NAME}`}
                uploadAriaLabel="Upload lead tenant signature image"
                value={signatures.tenant}
                onChange={updateTenantSignature}
              />

              <div className="hr" />

              <div className="row">
                <div>
                  <label htmlFor="witName">Witness name (optional)</label>
                  <input
                    id="witName"
                    type="text"
                    value={form.witnessName}
                    onChange={handleFormChange("witnessName")}
                  />
                </div>
                <div>
                  <SignaturePad
                    id="sigWitness"
                    label="Witness Signature (optional)"
                    ariaLabel="Signature pad for Witness"
                    uploadAriaLabel="Upload witness signature image"
                    value={signatures.witness}
                    onChange={updateWitnessSignature}
                  />
                </div>
              </div>

              <div className="toolbar">
                <button className="btn primary" type="button" onClick={handlePrint}>
                  Export as PDF
                </button>
              </div>
            </section>
          </div>

          <section className="agreement" id="agreement" aria-label="Agreement Preview" ref={previewRef}>
            <h3>Sub-Tenancy Agreement for Room Rental</h3>
            <p>
              <strong>Property:</strong> Flat 1, 61 Caledonian Crescent, Edinburgh
            </p>
            <div className="divider" />

            <p>
              This Sub-Tenancy Agreement (“the Agreement”) is made on <span>{displayAgreeDate}</span> between:
            </p>
            <ol className="party-list">
              <li>
                <strong>{LEAD_TENANT_NAME}</strong> (“the Tenant” or “lead tenant”), the primary tenant and
                current occupier who rents the property from the landlord through {MANAGING_AGENT} and has
                written permission to sub-let one room in the property; and
              </li>
              <li>
                <strong>{subTenants[0]?.name.trim() || "[Sub-Tenant 1]"}</strong> (“the Sub-Tenant”), of{' '}
                <span>{subTenants[0]?.address.trim() || "[Address 1]"}</span>.
                {hasCoSubTenant ? (
                  <>
                    <br />
                    <strong>{subTenants[1]?.name.trim() || "[Co-Sub-Tenant]"}</strong> (“the Co-Sub-Tenant”), of{' '}
                    <span>{subTenants[1]?.address.trim() || "[Address 2]"}</span>.
                  </>
                ) : null}
              </li>
            </ol>
            <p>
              Where a Co-Sub-Tenant resides with the Sub-Tenant, both individuals agree to comply with all terms
              of this Agreement and are jointly responsible for conduct, care of the property and any damage
              caused by them or their guests (fair wear and tear excepted).
            </p>

            <h4>1. Property and Facilities</h4>
            <p>
              The property is a two-bedroom ground-floor flat. The Sub-Tenant rents one private bedroom for
              exclusive use. Shared areas with the Tenant: kitchen, living room, shower/toilet and garden.
              Communal facilities include the central garden, heated pool, gym and sauna (access via factor fee
              included in rent).
            </p>

            <h4>2. Term</h4>
            <p>
              The Agreement begins on <span>{displayStartDate}</span> and continues monthly until ended under
              Section 12.
            </p>

            <h4>3. Rent and Payments</h4>
            <ul>
              <li>
                Monthly rent: <strong>£{displayRent}</strong> for the private room and shared/communal access.
              </li>
              <li>
                Due on the <strong>{displayRentDay}</strong> of each month, payable to {LEAD_TENANT_NAME}. Standing
                order recommended.
              </li>
              <li>
                The rent includes the factor fee for communal facilities and estate maintenance. The lead tenant
                continues to pay the full property rent to the landlord/agent.
              </li>
              <li>
                If rent is unpaid when due, the Tenant may issue notice requiring payment or removal and may apply
                to court for payment or removal.
              </li>
            </ul>

            <h4>4. Initial Payments (in place of a deposit)</h4>
            <p>
              The Sub-Tenant(s) pay the first and last month’s rent upfront (total £{displayInitTotal}) on signing.
              The last month’s rent is held to cover the final month of the tenancy. Following the Sub-Tenant’s
              departure, reasonable charges for any damage beyond fair wear and tear, professional cleaning if the
              property is not left in a clean state, or unpaid utilities may be recovered. The Tenant will provide
              receipts or other reasonable evidence for any such deductions. Any remaining balance will be returned
              to the Sub-Tenant(s).
            </p>

            <h4>5. Utilities and Council Tax</h4>
            <p>Electricity and council tax are split equally between the Tenant and the Sub-Tenant(s).</p>

            <h4>6. Access and Privacy</h4>
            <p>
              The Tenant will not access a Sub-Tenant’s private room without consent and at least 24 hours’ notice,
              except in emergencies (e.g. fire, flood, gas leak). The Sub-Tenant(s) will permit reasonable access for
              safety checks and repairs with at least 24 hours’ notice (emergencies excepted).
            </p>

            <h4>7. Inventory and Condition</h4>
            <p>
              An inventory for the room and shared areas will be completed at the start. The Sub-Tenant(s) have 7 days
              to raise discrepancies. On leaving, the room and shared areas must be clean and undamaged (fair wear and
              tear accepted).
            </p>

            <h4>8. House Rules</h4>
            <ul>
              <li>Be respectful towards the Tenant, neighbours and residents. No antisocial behaviour.</li>
              <li>Keep shared areas tidy after use and dispose of rubbish/recycling correctly.</li>
              <li>No large gatherings or parties; keep noise to reasonable levels, especially 22:00–07:00.</li>
              <li>No illegal drugs or criminal behaviour on the premises.</li>
              <li>No smoking or vaping inside the flat or common areas.</li>
              <li>No pets without prior written consent from the Tenant.</li>
              <li>
                Guests are permitted; please communicate plans to the Tenant in advance for awareness. No additional
                long-term occupiers without agreement.
              </li>
              <li>
                Use the Wi-Fi/Internet for lawful purposes only. Do not download or share illegal or indecent content.
              </li>
            </ul>

            <h4>9. Repairs and Safety</h4>
            <ul>
              <li>Report maintenance issues promptly to the Tenant ({LEAD_TENANT_NAME}).</li>
              <li>Do not tamper with smoke/heat alarms or safety devices. Report faults immediately.</li>
            </ul>

            <h4>10. Parking, Mail and Storage</h4>
            <ul>
              <li>Follow estate rules for parking, bike storage and communal spaces.</li>
              <li>Do not obstruct fire exits, hallways or shared access.</li>
              <li>Collect mail promptly; do not interfere with others’ mail.</li>
            </ul>

            <h4>11. Insurance</h4>
            <p>Sub-Tenant(s) are responsible for insuring their personal belongings.</p>

            <h4>12. Ending the Agreement</h4>
            <ul>
              <li>
                Either party may end this Agreement by giving at least {NOTICE_PERIOD} written notice. 4–6 weeks’ notice
                preferred.
              </li>
              <li>
                On leaving, return all keys/fobs and leave the room/shared areas clean and undamaged (fair wear and tear
                accepted).
              </li>
            </ul>

            <h4>13. Data Protection</h4>
            <p>
              Basic contact and tenancy details will be held by the Tenant and shared with the landlord/agent only for
              legitimate tenancy purposes.
            </p>

            <h4>14. General</h4>
            <p>
              This Agreement is the entire agreement and supersedes prior understandings. Changes must be in writing and
              signed. Governed by the law of Scotland. Parties will try to resolve disputes amicably before formal
              action.
            </p>

            <div className="divider" />

            <h4>Acceptance</h4>
            <p>
              By signing below, the Sub-Tenant(s) confirm they have read and understood this Agreement, agree to pay £
              {displayInitTotal} upfront (first and last month’s rent), then £{displayRent} on the {displayRentDay} of each
              month, agree to split utilities and council tax equally, follow the house rules, and give the required notice.
            </p>

            <div className="signing">
              {subTenants.map((subTenant, index) => {
                const label = index === 0 ? "Sub-Tenant" : "Co-Sub-Tenant";
                const signature = signatures.subTenants[index] ?? createDefaultSignature();
                return (
                  <div className="sig-block" key={`preview-sub-${index}`}>
                    <p>
                      <strong>{label}:</strong> {subTenant.name.trim() || `[Sub-Tenant ${index + 1}]`}
                    </p>
                    <img
                      className="sig-img"
                      alt={`${label} signature ${index + 1}`}
                      src={signature.dataUrl ?? undefined}
                      style={{ display: signature.dataUrl ? "block" : "none" }}
                    />
                    <div className="sig-line" />
                    <div className="printed-name">
                      Printed name: {subTenant.name.trim() || `[Sub-Tenant ${index + 1}]`}
                    </div>
                    <p className="stamp">Signed and dated: {signatureStampText(signature)}</p>
                  </div>
                );
              })}
            </div>

            <div className="signing">
              <div className="sig-block">
                <p>
                  <strong>Lead Tenant:</strong> {LEAD_TENANT_NAME}
                </p>
                <img
                  className="sig-img"
                  alt="Tenant signature"
                  src={signatures.tenant.dataUrl ?? undefined}
                  style={{ display: signatures.tenant.dataUrl ? "block" : "none" }}
                />
                <div className="sig-line" />
                <div className="printed-name">Printed name: {LEAD_TENANT_NAME}</div>
                <p className="stamp">Signed and dated: {signatureStampText(signatures.tenant)}</p>
              </div>
              <div className="sig-block">
                <p>
                  <strong>Witness (optional):</strong> {witnessDisplay}
                </p>
                <img
                  className="sig-img"
                  alt="Witness signature"
                  src={signatures.witness.dataUrl ?? undefined}
                  style={{ display: signatures.witness.dataUrl ? "block" : "none" }}
                />
                <div className="sig-line" />
                <div className="printed-name">Printed name: {witnessDisplay}</div>
                <p className="stamp">Signed and dated: {signatureStampText(signatures.witness)}</p>
              </div>
            </div>
          </section>

          <div className="toolbar" style={{ marginTop: "12px" }}>
            <button className="btn link" type="button" onClick={handleScrollToTop}>
              Back to form
            </button>
            <button className="btn" type="button" onClick={handleEmail}>
              Email David
            </button>
            <button className="btn primary" type="button" onClick={handlePrint}>
              Export as PDF
            </button>
          </div>
        </div>
      </main>
      <style jsx global>{`
        :root {
          --ink: #0b0c0c;
          --muted: #505a5f;
          --line: #b1b4b6;
          --line-strong: #505a5f;
          --accent: #1d70b8;
          --bg: #ffffff;
          --radius: 8px;
          --container: 960px;
          --danger: #d4351c;
          --success: #00703c;
        }
        * {
          box-sizing: border-box;
        }
        html,
        body {
          height: 100%;
        }
        body {
          margin: 0;
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial,
            sans-serif;
          background: #fff;
          color: var(--ink);
          line-height: 1.5;
        }
        .container {
          max-width: var(--container);
          margin: 24px auto 64px;
          padding: 0 16px;
        }
        .header {
          padding: 8px 0 16px;
          border-bottom: 4px solid var(--ink);
          position: sticky;
          top: 0;
          background: #fff;
          z-index: 2;
        }
        .header h1 {
          margin: 0 0 4px;
          font-size: 26px;
          font-weight: 800;
        }
        .subtitle {
          margin: 0;
          color: var(--muted);
          font-size: 14px;
        }
        .banner {
          border: 1px solid var(--line);
          border-left: 6px solid var(--accent);
          padding: 12px 14px;
          margin: 16px 0 20px;
          background: #f8f8f8;
          border-radius: 6px;
          font-size: 14px;
        }
        .tip {
          background: #fff3cd;
          border-color: #856404;
          color: #4d3b00;
        }
        .save-indicator {
          font-size: 12px;
          color: var(--muted);
          margin-left: auto;
        }
        .save-indicator[data-state='saved'] {
          color: var(--success);
        }
        .save-indicator[data-state='error'] {
          color: var(--danger);
        }
        .grid {
          display: grid;
          gap: 16px;
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
        .card {
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: #fff;
          padding: 16px;
        }
        .card h2 {
          margin: 0 0 8px;
          font-size: 18px;
        }
        .hr {
          height: 1px;
          background: var(--line);
          margin: 12px 0;
        }
        label {
          display: block;
          font-size: 14px;
          margin: 10px 0 6px;
        }
        .required::after {
          content: ' *';
          color: var(--danger);
        }
        .hint {
          display: block;
          font-size: 12px;
          color: var(--muted);
          margin-top: 2px;
        }
        .error {
          font-size: 12px;
          color: #fff;
          background: var(--danger);
          padding: 6px 8px;
          border-radius: 4px;
          margin-top: 6px;
        }
        input,
        select,
        textarea {
          width: 100%;
          padding: 10px 12px;
          border-radius: 6px;
          border: 1px solid var(--line);
          background: #fff;
          color: var(--ink);
          outline: none;
        }
        input[readonly] {
          background: #f3f2f1;
        }
        textarea {
          min-height: 110px;
          resize: vertical;
        }
        .row {
          display: grid;
          gap: 12px;
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 640px) {
          .row {
            grid-template-columns: 1fr;
          }
        }
        .toolbar {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
          align-items: center;
          margin-top: 14px;
        }
        .btn {
          appearance: none;
          border: 1px solid var(--line);
          background: #fff;
          color: var(--ink);
          cursor: pointer;
          padding: 10px 14px;
          border-radius: 6px;
          font-weight: 700;
        }
        .btn.primary {
          background: var(--accent);
          color: #fff;
          border-color: var(--accent);
        }
        .btn.link {
          background: transparent;
          border-color: transparent;
          color: var(--accent);
          text-decoration: underline;
        }
        .btn.ghost {
          background: #f8f8f8;
        }
        .agreement {
          margin-top: 20px;
          padding: 22px;
          background: #fff;
          color: #000;
          border: 1px solid var(--line);
          border-radius: var(--radius);
        }
        .agreement h3 {
          margin: 0 0 8px;
          font-size: 22px;
        }
        .agreement h4 {
          margin: 16px 0 8px;
          font-size: 18px;
        }
        .agreement p,
        .agreement li {
          font-size: 14px;
        }
        .divider {
          height: 2px;
          background: var(--line-strong);
          margin: 14px 0;
        }
        .signing {
          display: grid;
          gap: 16px;
          grid-template-columns: 1fr 1fr;
          margin-top: 8px;
        }
        @media (max-width: 900px) {
          .signing {
            grid-template-columns: 1fr;
          }
        }
        .sig-block {
          border: 1px solid var(--line);
          border-radius: 6px;
          padding: 12px;
          background: #fff;
        }
        .sig-line {
          height: 1px;
          background: #111;
          margin: 18px 0 6px;
        }
        .stamp {
          font-size: 12px;
          color: #333;
        }
        .printed-name {
          font-size: 13px;
        }
        .sig-pad {
          background: #fff;
          border: 1px dashed var(--line);
          border-radius: 6px;
          position: relative;
        }
        .sig-pad canvas {
          width: 100%;
          height: ${SIGNATURE_HEIGHT}px;
          display: block;
          touch-action: none;
        }
        .sig-tools {
          display: flex;
          gap: 8px;
          margin-top: 8px;
          flex-wrap: wrap;
        }
        .upload {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-top: 8px;
          flex-wrap: wrap;
        }
        .sig-img {
          max-width: 100%;
          max-height: 120px;
          display: none;
          border: 1px solid var(--line);
          border-radius: 4px;
          padding: 4px;
          background: #fff;
        }
        .party-list li + li {
          margin-top: 6px;
        }
        .sub-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
        }
        .sub-header h3 {
          margin: 0;
          font-size: 16px;
        }
        .sub-card {
          border: 1px dashed var(--line);
          border-radius: 6px;
          padding: 12px;
          margin-top: 8px;
        }
        @media print {
          .banner,
          .grid,
          .toolbar,
          .card,
          .hr,
          .header {
            display: none !important;
          }
          .agreement {
            border: none;
            margin: 0;
            border-radius: 0;
          }
          .container {
            margin: 0;
            padding: 0;
            max-width: none;
          }
          .sig-img {
            display: block !important;
          }
          .signing {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </>
  );
}
