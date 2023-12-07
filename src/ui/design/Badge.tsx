type Props = {
  children: React.ReactNode;
};

export default function Badge(props: Props) {
  return (
    <span className="rounded-sm bg-slate-100 px-2 py-1 text-sm text-gray-600">
      {props.children}
    </span>
  );
}
