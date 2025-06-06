"use client";
import { MapPin, Search } from "lucide-react";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface SearchProps {
  onSearch: (location: string) => void;
}

export default function SearchBar({ onSearch }: SearchProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery("");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto ">
      <div className="relative flex items-center">
        <div className="absolute left-3 z-10">
          <MapPin className="text-gray-500 h-5 w-5" />
        </div>
        <Input
          type="text"
          placeholder="都市名を入力してください"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-20 py-3 text-lg bg-white/90 rounded-full backdrop-blur-sm border-0 shadow-lg forcus:bg-white transition-all"
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-2 rouded-full bg-blue-500 hover:bg-blue-600 text-white px-4"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
