import memory from '@qavajs/memory';
import { logger } from './logger.js';

memory.setLogger(logger);

/** world of the scenario the memory storage was registered for */
let activeWorld;

/**
 * Create memory storage of a scenario from `memory` option of defineQavajs.
 * Class is instantiated, instance is copied (own properties, shallow) keeping its prototype,
 * so values saved by a scenario are not visible to the next one.
 * @param {object | (new () => object) | undefined} values - memory class or instance
 * @return {object}
 */
export function createStorage(values) {
    if (typeof values === 'function') return new (/** @type {new () => object} */ (values))();
    if (!values) return {};
    return Object.assign(Object.create(Object.getPrototypeOf(values)), values);
}

/**
 * Memory of the scenario that the world belongs to.
 * Every scenario creates its own world (in `describe` mode all worlds are created before the run),
 * so storage is registered when a step of another world uses memory.
 * World identity is used instead of scenario title, so example rows of an outline are isolated too.
 * @param {object} world - scenario world
 * @param {object | (new () => object) | undefined} values - memory class or instance
 * @return {typeof memory}
 */
export function scenarioMemory(world, values) {
    if (activeWorld !== world) {
        activeWorld = world;
        memory.register(createStorage(values));
    }
    return memory;
}
