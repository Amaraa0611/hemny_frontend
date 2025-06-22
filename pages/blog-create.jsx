          <div>
            <label className="block font-medium mb-1">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Slug *</label>
            <input name="slug" value={form.slug} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            {form.title && (
              <div className="mt-2 text-sm text-gray-600">
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="font-medium">Primary (Cyrillic):</span>
                    <span className="ml-2 text-indigo-600">{form.slug}</span>
                  </div>
                  <div>
                    <span className="font-medium">Fallback (English):</span>
                    <span className="ml-2 text-gray-500">{form.englishSlug}</span>
                  </div>
                </div>
              </div>
            )}
          </div> 