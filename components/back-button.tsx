import { useRouter } from "next/navigation";

interface BackButtonProps {
  to?: string; // đường dẫn muốn quay về, nếu có
  className?: string;
}

export default function BackButton({ to, className }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (to) {
      router.push(to);
    } else {
      router.back();
    }
  };

  return (
    <button onClick={handleBack} className={className}>
      {/* icon và text */}
      Quay lại
    </button>
  );
}