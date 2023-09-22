import Button from "../../ui/Button";

// onSetSettings - wrapped dispatch function
function SettingsTab({
  entryType,
  totalNumPosts,
  settings,
  onSetSettings,
  sortBySelections,
}) {
  const totalPages = Math.ceil(totalNumPosts / settings.limit);

  function handleChangeLimit(e) {
    if (settings.limit === e.target.value) return;
    onSetSettings({ limit: e.target.value, page: 1 });
  }
  function handleNextPage() {
    if (settings.page === totalPages) return;
    onSetSettings({ page: settings.page + 1 });
  }
  function handlePreviousPage() {
    if (settings.page === 1) return;
    onSetSettings({ page: settings.page - 1 });
  }
  function handleSortBy(e) {
    onSetSettings({ sortBy: e.target.value });
  }
  function handleChangeSortDirection() {
    onSetSettings({ sortDesc: !settings.sortDesc });
  }

  return (
    <div className="space-x-2 space-y-2 px-5 py-5 ">
      <span>Display</span>
      <select
        id="Display"
        value={settings.limit}
        onChange={handleChangeLimit}
        className=""
      >
        <option value={5}>5 {entryType}</option>
        <option value={10}>10 {entryType}</option>
        <option value={25}>25 {entryType}</option>
        <option value={50}>50 {entryType}</option>
        <option value={100}>100 {entryType}</option>
      </select>
      <span>Sort by</span>
      <select value={settings.sortBy} onChange={handleSortBy}>
        <option value={"created_at"}>date</option>
        <option value={"id"}>id</option>
      </select>
      <Button onclick={handleChangeSortDirection}>
        {settings.sortDesc ? "⬇️ Descending order" : "⬆️ Ascending order"}
      </Button>
      <span>
        Total {entryType}: {totalNumPosts}
      </span>
      <Button onclick={handlePreviousPage}>back</Button>
      <span>
        Page {settings.page} of {totalPages}
      </span>
      <Button onclick={handleNextPage}>forward</Button>
    </div>
  );
}

export default SettingsTab;
