/// <reference types="astro/client" />

type DB = import("@cloudflare/workers-types").D1Database;

declare namespace App {
  interface Locals {
    runtime: {
      env: {
        DB: DB;
      };
    };
  }
}
