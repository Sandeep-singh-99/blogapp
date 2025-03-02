"use client";

import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AllUser from "../../components/AllUser";
import AllBlog from "../../components/AllBlog";
import AllStats from "../../components/AllStats";

export default function AdminPortal() {
  return (
    <Tabs defaultValue="stats" className="w-full h-full p-2">
      <TabsList className="grid w-full grid-cols-3 shadow-md bg-gray-200 items-center dark:bg-slate-900">
        <TabsTrigger value="all-users">All Users</TabsTrigger>
        <TabsTrigger value="all-blog">All Blog</TabsTrigger>
        <TabsTrigger value="stats">Stats</TabsTrigger>
      </TabsList>
      <TabsContent value="all-users">
        <AllUser />
      </TabsContent>
      <TabsContent value="all-blog">
        <AllBlog />
      </TabsContent>

      <TabsContent value="stats">
        <AllStats />
      </TabsContent>
    </Tabs>
  );
}
