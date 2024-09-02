//import clsx from 'clsx';
import { getCustomers } from "../lib/queries";


export default async function LatestCustomers() {
    const latestInvoices = await getCustomers();
    return (
      <div>
        {latestInvoices.map((customer, i) => (
          <div key={i}>
            {customer.name}
          </div>
        ))}
      </div>
    );
}



