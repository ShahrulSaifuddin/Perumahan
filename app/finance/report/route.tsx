import { type NextRequest, NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { FinanceReportPDF } from "@/lib/pdf/finance-report";
import { getFinanceOverview } from "@/lib/api/finance";
import { getTransactions } from "@/lib/api/transactions";
import { getCurrentUserProfile } from "@/lib/api/users";

export async function GET(req: NextRequest) {
  const user = await getCurrentUserProfile();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const year = Number(searchParams.get("year")) || new Date().getFullYear();
  const targetPropertyId =
    user.property_id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"; // Fallback for admin

  const overview = await getFinanceOverview(targetPropertyId, year);
  const transactions = await getTransactions(targetPropertyId, { year });

  const stream = await renderToStream(
    <FinanceReportPDF
      year={year}
      overview={overview}
      transactions={transactions || []}
    />,
  );

  return new NextResponse(stream as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="finance-report-${year}.pdf"`,
    },
  });
}
