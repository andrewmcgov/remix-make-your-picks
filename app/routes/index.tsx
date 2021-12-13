import type { MetaFunction } from "remix";

// https://remix.run/api/conventions#meta
export const meta: MetaFunction = () => {
  return {
    title: "Make your picks",
    description: "NFL playoff picks"
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {

  return (
    <div className="remix__page">
      <main>
        <h2>Make your picks 2.0</h2>
      </main>
    </div>
  );
}
