export function SettingsTab({
  entryType,
  settings,
  onSetSettings,
  totalNumEntries,
}) {
  const pages = Math.ceil(totalNumEntries / settings.limit);

  function handleChangeLimit(e) {
    onSetSettings({
      ...settings,
      limit: e.target.value,
      page: 1,
    });
  }

  function handleNextPage() {
    if (settings.page === pages) return;
    onSetSettings({ ...settings, page: settings.page + 1 });
  }
  function handlePreviousPage() {
    if (settings.page === 1) return;
    onSetSettings({ ...settings, page: settings.page - 1 });
  }
  function handleSortBy(e) {
    onSetSettings({ ...settings, sortBy: e.target.value });
  }
  function toggleSortDirection() {
    onSetSettings({ ...settings, sortDesc: !settings.sortDesc });
  }

  return (
    <div>
      <span>Display</span>
      <select id="Display" value={settings.limit} onChange={handleChangeLimit}>
        <option value={5}>5 {entryType}</option>
        <option value={10}>10 {entryType}</option>
        <option value={25}>25 {entryType}</option>
        <option value={50}>50 {entryType}</option>
        <option value={100}>100 {entryType}</option>
      </select>
      <span>Sort by</span>
      <select value={settings.sortBy} onChange={handleSortBy}>
        <option value={'created_at'}>date</option>
        <option value={'id'}>id</option>
      </select>
      <button onClick={toggleSortDirection}>
        {settings.sortDesc ? '⬇️ Descending order' : '⬆️ Ascending order'}
      </button>
      <span>
        Total {entryType}: {totalNumEntries}
      </span>
      <button onClick={handlePreviousPage}>back</button>
      <span>
        Page {settings.page} of {pages}
      </span>
      <button onClick={handleNextPage}>forward</button>
    </div>
  );
}
