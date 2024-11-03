import { redirect } from "next/navigation";
import { handleSuccessfulPayment } from "@/app/server/actions/stripe";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Wait for searchParams to be available
  const resolvedParams = await searchParams;
  const transactionId = resolvedParams.transaction_id;

  // Type guard for transactionId
  if (!transactionId || Array.isArray(transactionId)) {
    redirect("/marketplace");
  }

  let success = false;
  try {
    await handleSuccessfulPayment(transactionId);
    success = true;
  } catch (error) {
    console.error("Payment processing error:", error);
    success = false;
  }

  if (success) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <h1 className="text-4xl font-bold">Thank you for your purchase!</h1>
          <p className="text-lg text-muted-foreground">
            Your transaction was successful and the cards have been added to
            your inventory.
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/inventory">View Inventory</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/marketplace">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <XCircle className="h-16 w-16 text-red-500" />
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="text-lg text-muted-foreground">
          We couldn&apos;t process your transaction. Please contact support if
          this persists.
        </p>
      </div>
      <Button variant="outline" asChild>
        <Link href="/marketplace">Return to Marketplace</Link>
      </Button>
    </div>
  );
}
