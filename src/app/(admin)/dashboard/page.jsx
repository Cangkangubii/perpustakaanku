import DashboardPage from "@/components/pageComponent/DashboardPage";
import { createClient } from "@/lib/server";

const getTotalBooks = async (supabase) => {
  const { data, error } = await supabase
    .from("books")
    .select("*", { count: "exact" });
  if (error) {
    console.error("Error fetching total books:", error);
    return 0;
  }
  return { data: data.length, error: error };
};

const getTotalCopies = async (supabase) => {
  const { data, error } = await supabase
    .from("book_copies")
    .select("*", { count: "exact" });
  if (error) {
    console.error("Error fetching total copies:", error);
    return 0;
  }

  return { data: data.length, error: error };
};

const getTotalMembers = async (supabase) => {
  const { data, error } = await supabase
    .from("members")
    .select("*", { count: "exact" });
  if (error) {
    console.error("Error fetching total members:", error);
    return 0;
  }
  return { data: data.length, error: error };
};

const getTotalBorrowedBooks = async (supabase) => {
  const { data, error } = await supabase
    .from("borrowings_items")
    .select("*", { count: "exact" });
  if (error) {
    console.error("Error fetching total borrowed books:", error);
    return 0;
  }
  return { data: data.length, error: error };
};

const getTotalAvailableBooks = async (supabase) => {
  const { data, error } = await supabase
    .from("book_copies")
    .select("*", { count: "exact" })
    .eq("status", "available");
  if (error) {
    console.error("Error fetching total available books:", error);
    return 0;
  }
  return { data: data.length, error: error };
};

export default async function Page() {
  const supabase = await createClient();
  const [
    { data: totalBooks, error: totalBooksError },
    { data: totalCopies, error: totalCopiesError },
    { data: totalMembers, error: totalMembersError },
    { data: totalBorrowedBooks, error: totalBorrowedBooksError },
    { data: totalAvailableBooks, error: totalAvailableBooksError },
  ] = await Promise.all([
    getTotalBooks(supabase),
    getTotalCopies(supabase),
    getTotalMembers(supabase),
    getTotalBorrowedBooks(supabase),
    getTotalAvailableBooks(supabase),
  ]);

  if (totalBooksError) throw totalBooksError;
  if (totalCopiesError) throw totalCopiesError;
  if (totalMembersError) throw totalMembersError;
  if (totalBorrowedBooksError) throw totalBorrowedBooksError;
  if (totalAvailableBooksError) throw totalAvailableBooksError;

  return (
    <DashboardPage
      totalBooks={totalBooks}
      totalCopies={totalCopies}
      totalMembers={totalMembers}
      totalBorrowedBooks={totalBorrowedBooks}
      totalAvailableBooks={totalAvailableBooks}
    />
  );
}
