import type { Metadata, Viewport } from "next";
import PageContainer from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "Pool Booking",
  description: "Book the pool session and choose your time slot.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function PoolBookingPage() {
  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-6">Book the Pool</h1>
        <p className="text-gray-700">
          This is where you’ll choose your time slot and confirm your booking.
        </p>
      </div>
    </PageContainer>
  );
}
