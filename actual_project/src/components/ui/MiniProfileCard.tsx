type MiniProfileProps = {
  name: string;
  photoUrl: string;
  interests: string[];
};

export default function MiniProfileCard({ name, photoUrl, interests }: MiniProfileProps) {
  return (
    <div className="bg-white shadow rounded p-4 w-56">
      <img
        src={photoUrl}
        alt={name}
        className="rounded-full w-20 h-20 mx-auto"
      />
      <h2 className="text-center mt-2 font-semibold">{name}</h2>
      <p className="text-xs text-center text-gray-500">
        {interests.join(", ")}
      </p>
    </div>
  );
}