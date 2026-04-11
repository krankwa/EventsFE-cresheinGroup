import { ShieldAlert, Home, ArrowLeft, MoveLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-24 text-center sm:py-32 lg:px-8">
      <div className="rounded-full bg-red-50 p-4">
        <ShieldAlert className="h-12 w-12 text-red-600" />
      </div>

      <p className="mt-6 text-base font-semibold text-red-600">403 Error</p>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        Access Denied
      </h1>

      <p className="mt-6 text-base leading-7 text-gray-600 max-w-lg">
        Sorry, you don't have the required permissions to view this page.
      </p>

      <div className="mt-10 flex items-center justify-center gap-x-6">
        <button className="flex items-center gap-2 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 transition-all">
          <MoveLeft className="h-4 w-4" />
          Back
        </button>
      </div>
    </div>
  );
}
