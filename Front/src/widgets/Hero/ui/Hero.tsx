import Button from "@/shared/ui/atoms/Button/ui/Button";
import Link from "next/link";

export default function Hero() {
  return (
    <>
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-white text-4xl font-bold animate-fade-up-1">
          Build your video.
        </h1>
        <p className="text-zinc-400 text-lg animate-fade-up-2">
          Create, Edit, and Share your videos with VideoEditorH.
        </p>
      </div>

      <div className="flex gap-4 items-center animate-fade-up-2">
        <Button>
          <Link href="/projects">Try now</Link>
        </Button>
      </div>
    </>
  );
}
