import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import "../../styles/AdminDashboard.css";
import Footer from "../../layout/Footer.jsx"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
const API_URL = import.meta.env.VITE_API_URL;
const COLORS = ["#0f5555", "#1f8a8a", "#35b7b7", "#7adada", "#bff3f3"];

const monthName = (month) =>
  ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month - 1];

const formatMonthly = (items = [], key = "count") =>
  items.map((item) => ({
    month: `${monthName(item._id.month)} ${item._id.year}`,
    value: item[key] || item.count || 0,
  }));

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/admin/dashboard`, { withCredentials: true });
      setDashboard(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="dashboard-loader">Loading analytics...</div>
      </>
    );
  }

  const stats = dashboard?.stats || {};

  const growthData = formatMonthly(dashboard?.monthlyUsers);
  const revenueData = formatMonthly(dashboard?.monthlyRevenue, "revenue");
  const ordersData = formatMonthly(dashboard?.monthlyOrders);
  const coursesData = formatMonthly(dashboard?.monthlyCourses);
  const jobsData = formatMonthly(dashboard?.monthlyJobs);

  const roleData =
    dashboard?.roleStats?.map((item) => ({
      name: item._id,
      value: item.count,
    })) || [];

  const orderStatusData =
    dashboard?.orderStatusStats?.map((item) => ({
      name: item._id,
      value: item.count,
    })) || [];

  const platformData = [
    { name: "Users", value: stats.totalUsers || 0 },
    { name: "Courses", value: stats.totalCourses || 0 },
    { name: "Jobs", value: stats.totalJobs || 0 },
    { name: "Gigs", value: stats.totalGigs || 0 },
    { name: "Orders", value: stats.totalOrders || 0 },
    { name: "Blogs", value: stats.totalBlogs || 0 },
  ];

  const revenueCards = [
    { title: "Total Revenue", value: `$${stats.totalRevenue || 0}`, icon: "bi-cash-stack" },
    { title: "Order Value", value: `$${stats.totalOrderValue || 0}`, icon: "bi-graph-up-arrow" },
    { title: "Pending Amount", value: `$${stats.pendingAmount || 0}`, icon: "bi-hourglass-split" },
    { title: "Messages", value: stats.totalMessages || 0, icon: "bi-chat-dots" },
  ];

  return (
    <>
      <AdminNavbar />

      <main className="pro-dashboard">
        <section className="hero-panel">
          <div>
            <span className="dashboard-label">DevTech Analytics</span>
            <h1>Platform Intelligence Dashboard</h1>
            <p>Real-time overview of learning, jobs, marketplace, revenue and users.</p>
          </div>

          <button onClick={fetchDashboard}>
            <i className="bi bi-arrow-clockwise"></i>
            Refresh Data
          </button>
        </section>

        <section className="kpi-grid">
          {revenueCards.map((item, index) => (
            <div className="kpi-card" key={index}>
              <div className="kpi-icon">
                <i className={`bi ${item.icon}`}></i>
              </div>
              <div>
                <h3>{item.value}</h3>
                <p>{item.title}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="dashboard-grid">
          <div className="glass-card wide-card">
            <div className="card-head">
              <div>
                <h4>User Growth</h4>
                <p>Monthly platform registration trend</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={340}>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f5555" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#0f5555" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e7eeee" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0f5555"
                  strokeWidth={4}
                  fill="url(#growthGradient)"
                  activeDot={{ r: 7 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card">
            <div className="card-head">
              <div>
                <h4>Role Distribution</h4>
                <p>Users by account type</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={340}>
              <PieChart>
                <Pie
                  data={roleData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={75}
                  outerRadius={120}
                  paddingAngle={4}
                >
                  {roleData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card">
            <div className="card-head">
              <div>
                <h4>Revenue Flow</h4>
                <p>Monthly paid amount</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e7eeee" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0f5555"
                  strokeWidth={4}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card">
            <div className="card-head">
              <div>
                <h4>Order Status</h4>
                <p>Marketplace order pipeline</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart
                innerRadius="20%"
                outerRadius="95%"
                data={orderStatusData}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar dataKey="value" cornerRadius={15} fill="#0f5555" />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card wide-card">
            <div className="card-head">
              <div>
                <h4>Platform Modules</h4>
                <p>Total records across major system modules</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={330}>
              <BarChart data={platformData} barSize={42}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e7eeee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[18, 18, 0, 0]} fill="#0f5555" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card">
            <div className="card-head">
              <div>
                <h4>Orders Growth</h4>
                <p>Monthly order creation</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={ordersData}>
                <defs>
                  <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1f8a8a" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#1f8a8a" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#1f8a8a"
                  strokeWidth={4}
                  fill="url(#ordersGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card">
            <div className="card-head">
              <div>
                <h4>Courses Growth</h4>
                <p>Monthly course creation</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={coursesData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#35b7b7" radius={[16, 16, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card">
            <div className="card-head">
              <div>
                <h4>Jobs Growth</h4>
                <p>Monthly job posting trend</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={jobsData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#7adada" radius={[16, 16, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
};

export default AdminDashboard;