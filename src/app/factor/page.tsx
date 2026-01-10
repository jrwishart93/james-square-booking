import type { Metadata, Viewport } from "next";
import PageContainer from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "Fior Asset & Property - Factor",
  description:
    "James Square is managed by Fior Asset & Property, a trusted property management company.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function FactorPage() {
  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Fior Asset & Property
        </h1>
        <p className="mb-6 text-lg">
          James Square is managed by Fior Asset & Property
          management company.
        </p>
        <p className="mb-6 text-lg">
          Fior is responsible for the ongoing maintenance and upkeep of the James
          Square development — including communal areas, landscaping, and shared
          facilities. If you have any concerns, questions, or would like to raise an
          issue about the property, you can contact them directly:
        </p>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Contact Details</h2>
          <p>
            <strong>Director:</strong> Pedrom Aghabala
          </p>
          <p>
            <strong>Phone:</strong> 0333 444 0586
          </p>
          <p>
            <strong>Mobile:</strong> 07548 910618
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:info@fiorassetandproperty.com"
              className="text-blue-600 underline"
            >
              info@fiorassetandproperty.com
            </a>
          </p>
          <p>
            <strong>Web:</strong>{" "}
            <a
              href="https://www.fiorassetandproperty.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              www.fiorassetandproperty.com
            </a>
          </p>
        </section>
      </div>
    </PageContainer>
  );
}
