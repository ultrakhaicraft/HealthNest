import { IconRetry } from "./IconList";

export const RefreshButton = ({ onRefresh, loading }: { onRefresh: () => void; loading: boolean }) => {
    return (
        <button className="button button-secondary button-large" onClick={onRefresh} disabled={loading}>
            <IconRetry /> Refresh
        </button>
    )
}