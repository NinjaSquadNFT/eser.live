import { useSignal } from "@preact/signals";

export default function NewsFormIsland() {
  const titleSignal = useSignal("");
  const contentSignal = useSignal("");

  return (
    <form method="POST" class="form-control w-full max-w-lg">
      <label class="label">
        <span class="label-text">Title</span>
      </label>
      <input
        type="text"
        name="title"
        value={titleSignal.value}
        onInput={(e) => titleSignal.value = e.currentTarget.value}
        class="input input-bordered input-primary w-full"
        required={true}
      />
      <label class="label mt-4">
        <span class="label-text">Content</span>
      </label>
      <textarea
        name="content"
        value={contentSignal.value}
        onInput={(e) => contentSignal.value = e.currentTarget.value}
        class="textarea textarea-bordered textarea-primary h-32 w-full"
        required={true}
      >
      </textarea>
      <button type="submit" class="btn btn-primary mt-6">Submit</button>
    </form>
  );
}
