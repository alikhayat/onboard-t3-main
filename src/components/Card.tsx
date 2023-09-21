interface CardProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export default function Card({ children, title, description }: CardProps) {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>{description}</p>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
