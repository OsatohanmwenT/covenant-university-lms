import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Form from "next/form";

const SearchInput = ({ query }: { query: string }) => {
  return (
    <Form scroll={false} className="search" action="/search">
      <Search className="text-light-200" />
      <Input
        name="query"
        defaultValue={query}
        placeholder="Search by title or keywords"
        className="search-input"
      />
    </Form>
  );
};
export default SearchInput;
