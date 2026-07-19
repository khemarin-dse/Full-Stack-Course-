import { useCallback, useEffect, useState } from "react";

export default function useCrud(service) {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================
  // LOAD DATA
  // =========================
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await service.getAll();
      setData(res);
    } catch (err) {
      console.error("CRUD Load Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }

  }, [service]);

  // =========================
  // INIT LOAD
  // =========================
  useEffect(() => {
    load();
  }, [load]);

  // =========================
  // CREATE
  // =========================
  const create = async (item) => {
    try {
      await service.create(item);
      await load();
    } catch (err) {
      console.error("Create Error:", err);
    }
  };

  // =========================
  // UPDATE
  // =========================
  const update = async (id, item) => {
    try {
      await service.update(id, item);
      await load();
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  // =========================
  // DELETE
  // =========================
  const remove = async (id) => {
    try {
      await service.remove(id);
      await load();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  // =========================
  // RETURN API
  // =========================
  return {
    data,
    loading,
    error,
    create,
    update,
    remove,
    reload: load
  };
}