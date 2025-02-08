import GoogleMap from "@/components/map/GoogleMap";

export default function TestGoogleMap({
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
}: {
  apiKey: any;
}) {
  return (
    <div className="w-full h-full">{/* <GoogleMap apiKey={apiKey} /> */}</div>
  );
}
