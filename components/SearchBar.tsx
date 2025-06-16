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
  //入力の状態管理

  //フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery("");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-lg w-full mx-auto ">
      <div className="relative flex items-center">
        <div className="absolute left-4 z-10">
          <MapPin className="text-gray-500 h-6 w-6" />
        </div>
        <Input
          type="text"
          placeholder="都市名を入力してください(ローマ字で)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-14 pr-24 py-5 text-xl bg-white/90 rounded-full backdrop-blur-sm border-0 shadow-lg forcus:bg-white transition-all"
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-3 rouded-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-xl"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}
