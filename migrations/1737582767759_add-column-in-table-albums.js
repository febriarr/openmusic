/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.addColumns('albums', {
        created_at: {
            type: 'TIMESTAMP',
            default: pgm.func('CURRENT_TIMESTAMP'),
            notNull: true,
        },
        updated_at: {
            type: 'TIMESTAMP',
            default: pgm.func('CURRENT_TIMESTAMP'),
            notNull: true,
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropColumns('albums', ['created_at', 'updated_at']);
};
