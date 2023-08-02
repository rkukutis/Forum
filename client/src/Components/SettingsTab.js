import { usePosts } from '../contexts/PostsContext';
import Button from './Button';

function SettingsTab({ entryType, settings, onSetSettings, totalNumEntries }) {
  const { totalPosts, sortSettings, updateSortSettings } = usePosts();
  const totalPages = Math.ceil(totalPosts / sortSettings.limit);

  function handleChangeLimit(e) {
    if (sortSettings.limit === e.target.value) return;
    updateSortSettings({ limit: e.target.value, page: 1 });
  }
  function handleNextPage(e) {
    if (sortSettings.page === totalPages) return;
    updateSortSettings({ page: sortSettings.page + 1 });
  }
  function handlePreviousPage() {
    if (settings.page === 1) return;
    updateSortSettings({ page: sortSettings.page - 1 });
  }
  function handleSortBy(e) {
    updateSortSettings({ sortBy: e.target.value });
  }
  // FIX: doesn't work
  function toggleSortDirection() {
    onSetSettings({ sortDesc: !sortSettings.sortDesc });
  }

  return (
    <div>
      <span>Display</span>
      <select
        id="Display"
        value={sortSettings.limit}
        onChange={handleChangeLimit}
      >
        <option value={5}>5 {entryType}</option>
        <option value={10}>10 {entryType}</option>
        <option value={25}>25 {entryType}</option>
        <option value={50}>50 {entryType}</option>
        <option value={100}>100 {entryType}</option>
      </select>
      <span>Sort by</span>
      <select value={sortSettings.sortBy} onChange={handleSortBy}>
        <option value={'created_at'}>date</option>
        <option value={'id'}>id</option>
      </select>
      <Button onclick={toggleSortDirection}>
        {sortSettings.sortDesc ? '⬇️ Descending order' : '⬆️ Ascending order'}
      </Button>
      <span>
        Total {entryType}: {totalNumEntries}
      </span>
      <Button onclick={handlePreviousPage}>back</Button>
      <span>
        Page {sortSettings.page} of {totalPages}
      </span>
      <Button onclick={handleNextPage}>forward</Button>
    </div>
  );
}

export default SettingsTab;
