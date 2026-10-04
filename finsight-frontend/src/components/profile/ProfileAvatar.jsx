import { Camera, UserRound } from "lucide-react";

function ProfileAvatar({
  name = "",
  imageUrl = "",
  size = "large",
  editable = false,
  onChange,
}) {
  const initials = name
    ? name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "U";

  const sizeClasses = {
    small: "h-10 w-10 text-sm",
    medium: "h-14 w-14 text-lg",
    large: "h-24 w-24 text-2xl",
  };

  const avatarSize =
    sizeClasses[size] || sizeClasses.large;

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      onChange?.(file);
    }
  };

  return (
    <div className="relative inline-block">
      <div
        className={`flex ${avatarSize} items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-white shadow-lg shadow-purple-200/40`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${name || "User"} profile`}
            className="h-full w-full object-cover"
          />
        ) : name ? (
          initials
        ) : (
          <UserRound size={size === "large" ? 30 : 20} />
        )}
      </div>

      {editable && (
        <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-slate-900 text-white shadow-md transition-transform hover:scale-105">
          <Camera size={14} />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}

export default ProfileAvatar;
