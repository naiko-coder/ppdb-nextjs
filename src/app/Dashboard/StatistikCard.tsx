"use client";
import React, { useImperativeHandle, useState, useEffect, forwardRef } from "react";

const StatistikCard = forwardRef((props, ref) => {
  const [stat, setStat] = useState({ total: 0, sudah: 0, belum: 0 });
  const [loading, setLoading] = useState(false);

  const fetchStat = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/statistik");
      if (!res.ok) throw new Error("Gagal fetch statistik");
      const data = await res.json();
      setStat(data);
    } catch {
      setStat({ total: 0, sudah: 0, belum: 0 });
    }
    setLoading(false);
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchStat,
  }));

  useEffect(() => {
    fetchStat();
  }, []);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-6 mt-6 px-4">
      <div className="rounded-lg shadow flex items-center p-6 bg-blue-100 text-blue-700 w-full">
        <div className="text-3xl mr-4">👨‍🎓</div>
        <div>
          <div className="text-2xl font-bold">{stat.total}</div>
          <div className="text-sm">Total Pendaftar</div>
        </div>
      </div>
      <div className="rounded-lg shadow flex items-center p-6 bg-green-100 text-green-700 w-full">
        <div className="text-3xl mr-4">✅</div>
        <div>
          <div className="text-2xl font-bold">{stat.sudah}</div>
          <div className="text-sm">Sudah Dicetak</div>
        </div>
      </div>
      <div className="rounded-lg shadow flex items-center p-6 bg-yellow-100 text-yellow-700 w-full">
        <div className="text-3xl mr-4">⏳</div>
        <div>
          <div className="text-2xl font-bold">{stat.belum}</div>
          <div className="text-sm">Belum Dicetak</div>
        </div>
      </div>
    </section>
  );
});

export default StatistikCard;