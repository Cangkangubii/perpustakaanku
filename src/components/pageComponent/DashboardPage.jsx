import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

const DashboardPage = ({
  totalBooks,
  totalCopies,
  totalMembers,
  totalBorrowedBooks,
  totalAvailableBooks,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-bold ">Dashboard</h1>
      <div className="flex gap-4  p-4 rounded-lg justify-between">
        <Card className="w-full hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Total Books</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{totalBooks}</p>
          </CardContent>
        </Card>
        <Card className="w-full hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Total Copies</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{totalCopies}</p>
          </CardContent>
        </Card>
        <Card className="w-full hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{totalMembers}</p>
          </CardContent>
        </Card>
        <Card className="w-full hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Total Borrowed Books</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{totalBorrowedBooks}</p>
          </CardContent>
        </Card>
        <Card className="w-full hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Total Available Books</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{totalAvailableBooks}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
