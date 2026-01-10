import VotingClient from "@/app/owners/voting/VotingClient";
import PageContainer from "@/components/layout/PageContainer";

export default function SecureVotingPage() {
  return (
    <PageContainer className="max-w-none px-0">
      <VotingClient />
    </PageContainer>
  );
}
