import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AppLayout } from "./app/layouts/AppLayout";
import { RequireAuth } from "./app/router/RequireAuth";
import { PageLoader } from "./shared/components/PageLoader";

const LoginPage = lazy(() =>
  import("./modules/auth/pages/LoginPage").then((m) => ({
    default: m.LoginPage,
  })),
);
const RegisterPage = lazy(() =>
  import("./modules/auth/pages/RegisterPage").then((m) => ({
    default: m.RegisterPage,
  })),
);
const ForgotPasswordPage = lazy(() =>
  import("./modules/auth/pages/ForgotPasswordPage").then((m) => ({
    default: m.ForgotPasswordPage,
  })),
);
const ResetPasswordPage = lazy(() =>
  import("./modules/auth/pages/ResetPasswordPage").then((m) => ({
    default: m.ResetPasswordPage,
  })),
);
const DashboardPage = lazy(() =>
  import("./modules/dashboard/pages/DashboardPage").then((m) => ({
    default: m.DashboardPage,
  })),
);
const OnboardingPage = lazy(() =>
  import("./modules/onboarding/pages/OnboardingPage").then((m) => ({
    default: m.OnboardingPage,
  })),
);
const MarketingSpendPage = lazy(() =>
  import("./modules/marketing-spend/pages/MarketingSpendPage").then((m) => ({
    default: m.MarketingSpendPage,
  })),
);
const BdActivityPage = lazy(() =>
  import("./modules/bd-activity/pages/BdActivityPage").then((m) => ({
    default: m.BdActivityPage,
  })),
);
const OperationalCostPage = lazy(() =>
  import("./modules/operational-cost/pages/OperationalCostPage").then((m) => ({
    default: m.OperationalCostPage,
  })),
);
const RevenueDataPage = lazy(() =>
  import("./modules/revenue-data/pages/RevenueDataPage").then((m) => ({
    default: m.RevenueDataPage,
  })),
);
const AdAccountsPage = lazy(() =>
  import("./modules/ad-accounts/pages/AdAccountsPage").then((m) => ({
    default: m.AdAccountsPage,
  })),
);
const TrendsPage = lazy(() =>
  import("./modules/dashboard/pages/TrendsPage").then((m) => ({
    default: m.TrendsPage,
  })),
);
const ComparisonPage = lazy(() =>
  import("./modules/comparison/pages/ComparisonPage").then((m) => ({
    default: m.ComparisonPage,
  })),
);
const InsightsPage = lazy(() =>
  import("./modules/insights/pages/InsightsPage").then((m) => ({
    default: m.InsightsPage,
  })),
);
const ScenariosPage = lazy(() =>
  import("./modules/scenarios/pages/ScenariosPage").then((m) => ({
    default: m.ScenariosPage,
  })),
);
const BillingPage = lazy(() =>
  import("./modules/billing/pages/BillingPage").then((m) => ({
    default: m.BillingPage,
  })),
);
const ReportsPage = lazy(() =>
  import("./modules/reports/pages/ReportsPage").then((m) => ({
    default: m.ReportsPage,
  })),
);
const AdminUsersPage = lazy(() =>
  import("./modules/admin/pages/AdminUsersPage").then((m) => ({
    default: m.AdminUsersPage,
  })),
);
const AdminRevenuePage = lazy(() =>
  import("./modules/admin/pages/AdminRevenuePage").then((m) => ({
    default: m.AdminRevenuePage,
  })),
);
const EcosystemPage = lazy(() =>
  import("./modules/ecosystem/pages/EcosystemPage").then((m) => ({
    default: m.EcosystemPage,
  })),
);
const ActionsPage = lazy(() =>
  import("./modules/actions/pages/ActionsPage").then((m) => ({
    default: m.ActionsPage,
  })),
);
const ReviewPage = lazy(() =>
  import("./modules/review/pages/ReviewPage").then((m) => ({
    default: m.ReviewPage,
  })),
);
const BudgetPage = lazy(() =>
  import("./modules/budget/pages/BudgetPage").then((m) => ({
    default: m.BudgetPage,
  })),
);
const CompliancePage = lazy(() =>
  import("./modules/compliance/pages/CompliancePage").then((m) => ({
    default: m.CompliancePage,
  })),
);
const SettingsPage = lazy(() =>
  import("./modules/settings/pages/SettingsPage").then((m) => ({
    default: m.SettingsPage,
  })),
);
const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage").then((m) => ({
    default: m.NotFoundPage,
  })),
);

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Onboarding (authenticated, no sidebar) */}
        <Route
          path="/onboarding"
          element={
            <RequireAuth>
              <OnboardingPage />
            </RequireAuth>
          }
        />

        {/* Protected app shell */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Data Input Modules */}
          <Route path="data/marketing" element={<MarketingSpendPage />} />
          <Route path="data/bd" element={<BdActivityPage />} />
          <Route path="data/operational" element={<OperationalCostPage />} />
          <Route path="data/revenue" element={<RevenueDataPage />} />
          <Route path="accounts" element={<AdAccountsPage />} />
          <Route path="analytics/trends" element={<TrendsPage />} />
          <Route path="analytics/compare" element={<ComparisonPage />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="scenarios" element={<ScenariosPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="ecosystem" element={<EcosystemPage />} />
          <Route path="actions" element={<ActionsPage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="compliance" element={<CompliancePage />} />
          <Route path="admin/users" element={<AdminUsersPage />} />
          <Route path="admin/revenue" element={<AdminRevenuePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="settings/profile" element={<SettingsPage />} />
          <Route path="settings/account" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
