/**
 * Clusters serve as data holders throughout the library.
 * They are a combination of JavaScript Maps and Arrays with the
 * ability to hold large amount of data.
 * @class
 * @extends Map
 * @template K, V
 */
class Cluster<K, V> extends Map {
  /**
   * Whether the given argument is a cluster
   * @param {*} cluster Data to check if cluster
   * @returns {boolean}
   */
  public static isCluster(cluster: unknown): boolean {
    return cluster instanceof Cluster;
  }

  /**
   * Filters the map according to the given callback function, and
   * returns a new filtered {@link Cluster}.
   * Equivalent to {@link Array.filter}
   * @param {function(value: V, key: K, cluster: this): boolean} cb Callback function
   * @returns {Cluster<K, V>}
   */
  public filter(cb: (value: V, key: K, cluster: this) => boolean): Cluster<K, V> {
    const cluster = new Cluster<K, V>();

    for (const [key, value] of this) {
      if (cb(value, key, this)) {
        cluster.set(key, value);
      }
    }

    return cluster;
  }
}

export default Cluster;
