CREATE DATABASE IF NOT EXISTS behavioral;

CREATE TABLE IF NOT EXISTS behavioral.events (
    event_id UUID DEFAULT generateUUIDv4(),
    event_type Enum8(
        'petition.viewed' = 1,
        'petition.skipped' = 2,
        'petition.interested' = 3,
        'petition.signed' = 4
    ),
    session_id String,
    user_id Nullable(UUID),
    petition_id UUID,
    dwell_time_s UInt16 DEFAULT 0,
    created_at DateTime DEFAULT now()
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(created_at)
ORDER BY
    (session_id, petition_id, created_at);