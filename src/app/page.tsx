import LatestCustomers from "./ui/data_display";
import UrlForm from "./ui/url_form";

export default async function Page() {
  return (
    <main className="space-y-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">URL Tester</h1>
          <UrlForm />
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Latest Customers</h2>
          <LatestCustomers />
        </div>
      </div>
    </main>
  )
}