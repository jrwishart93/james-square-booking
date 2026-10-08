import { describe, expect, it } from "vitest";
import { suggestAddress } from "./address";

describe("suggestAddress", () => {
  it("completes a property number", () => {
    expect(suggestAddress("59/2")).toBe("59/2 Caledonian Crescent, Edinburgh");
    expect(suggestAddress(" 7/10 ")).toBe("7/10 Caledonian Crescent, Edinburgh");
    expect(suggestAddress("101")).toBe("101 Caledonian Crescent, Edinburgh");
  });

  it("keeps suggesting while the street is typed", () => {
    expect(suggestAddress("59/2 cal")).toBe("59/2 Caledonian Crescent, Edinburgh");
    expect(suggestAddress("59/2 Caledonian Crescent")).toBe("59/2 Caledonian Crescent, Edinburgh");
  });

  it("offers nothing once the address is complete or different", () => {
    expect(suggestAddress("59/2 Caledonian Crescent, Edinburgh")).toBeNull();
    expect(suggestAddress("59/2 Orwell Terrace")).toBeNull();
    expect(suggestAddress("Flat 2")).toBeNull();
    expect(suggestAddress("")).toBeNull();
    expect(suggestAddress("59/")).toBeNull();
  });
});
