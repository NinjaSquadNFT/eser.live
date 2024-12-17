export function NewsForm() {
  return (
    <form method="POST" class="space-y-4">
      <div>
        <label class="block text-sm font-medium">Title</label>
        <input type="text" name="title" required class="mt-1 block w-full" />
      </div>
      <div>
        <label class="block text-sm font-medium">Description</label>
        <textarea name="description" required class="mt-1 block w-full" />
      </div>
      <div>
        <label class="block text-sm font-medium">Content</label>
        <textarea name="content" required class="mt-1 block w-full h-64" />
      </div>
      <div>
        <label class="block text-sm font-medium">Image URL</label>
        <input type="url" name="storyPictureUri" class="mt-1 block w-full" />
      </div>
      <div>
        <label class="flex items-center">
          <input type="checkbox" name="is_featured" class="mr-2" />
          <span class="text-sm font-medium">Featured</span>
        </label>
      </div>
      <div>
        <button type="submit" name="status" value="draft" class="btn btn-secondary mr-2">Save as Draft</button>
        <button type="submit" name="status" value="published" class="btn btn-primary">Publish</button>
      </div>
    </form>
  );
}
