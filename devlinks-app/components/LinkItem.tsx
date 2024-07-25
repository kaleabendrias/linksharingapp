interface LinkItemProps {
  id: number;
  platform: string;
  link: string;
  onChange: (id: number, field: string, value: string) => void;
  onRemove: (id: number) => void;
}

const LinkItem: React.FC<LinkItemProps> = ({
  id,
  platform,
  link,
  onChange,
  onRemove,
}) => {
  return (
    <div className="flex flex-col space-y-4 p-4 border rounded-md shadow-sm">
      <div className="flex justify-between items-center">
        <label
          htmlFor={`platform-${id}`}
          className="block text-sm font-medium text-gray-700"
        >
          Platform
        </label>
        <button
          type="button"
          className="text-red-500"
          onClick={() => onRemove(id)}
        >
          Remove
        </button>
      </div>
      <select
        id={`platform-${id}`}
        value={platform}
        onChange={(e) => onChange(id, "platform", e.target.value)}
        className="block w-full p-2 border rounded-md shadow-sm"
      >
        <option value="GitHub">GitHub</option>
        <option value="Twitter">Twitter</option>
        <option value="LinkedIn">LinkedIn</option>
        <option value="Website">Website</option>
      </select>
      <label
        htmlFor={`link-${id}`}
        className="block text-sm font-medium text-gray-700"
      >
        Link
      </label>
      <input
        type="url"
        id={`link-${id}`}
        value={link}
        onChange={(e) => onChange(id, "link", e.target.value)}
        className="block w-full p-2 border rounded-md shadow-sm"
        placeholder="e.g. https://github.com/username"
      />
    </div>
  );
};

export default LinkItem;
