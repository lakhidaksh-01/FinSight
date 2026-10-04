import { Search, X, SlidersHorizontal } from "lucide-react";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "Food", label: "Food & Dining" },
  { value: "Transport", label: "Transport" },
  { value: "Shopping", label: "Shopping" },
  { value: "Bills", label: "Bills & Utilities" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Health", label: "Health & Medical" },
  { value: "Education", label: "Education" },
  { value: "Travel", label: "Travel" },
  { value: "Other", label: "Other" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest", label: "Highest Amount" },
  { value: "lowest", label: "Lowest Amount" },
];

function ExpenseFilters({
  filters,
  onChange,
  onReset,
}) {
  const safeFilters = {
    search: "",
    category: "all",
    sort: "newest",
    dateFrom: "",
    dateTo: "",
    ...filters,
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    onChange?.({
      ...safeFilters,
      [name]: value,
    });
  };

  const hasActiveFilters =
    safeFilters.search ||
    safeFilters.category !== "all" ||
    safeFilters.sort !== "newest" ||
    safeFilters.dateFrom ||
    safeFilters.dateTo;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Filter heading */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <SlidersHorizontal size={17} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Filter Expenses</h3>
            <p className="text-xs text-slate-500">
              Find and organize your transactions
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="small"
            icon={X}
            onClick={onReset}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="mb-5">
        <Input
          label="Search"
          name="search"
          value={safeFilters.search}
          onChange={handleChange}
          placeholder="Search expenses..."
          icon={<Search size={17} />}
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          label="Category"
          name="category"
          value={safeFilters.category}
          onChange={handleChange}
          options={CATEGORY_OPTIONS}
        />

        <Select
          label="Sort By"
          name="sort"
          value={safeFilters.sort}
          onChange={handleChange}
          options={SORT_OPTIONS}
        />

        <Input
          label="From Date"
          name="dateFrom"
          type="date"
          value={safeFilters.dateFrom}
          onChange={handleChange}
        />

        <Input
          label="To Date"
          name="dateTo"
          type="date"
          value={safeFilters.dateTo}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default ExpenseFilters;