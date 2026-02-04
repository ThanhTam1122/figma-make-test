import { useState } from 'react';
import { MobileLayout } from '@/app/components/layout/mobile-layout';
import { HomePage } from '@/app/components/pages/home-page';
import { SchedulePage } from '@/app/components/pages/schedule-page';
import { PaymentPage } from '@/app/components/pages/payment-page';
import { RewardPage } from '@/app/components/pages/reward-page';
import { ClientRegistration } from '@/app/components/registration/client-registration';
import { SupporterRegistration } from '@/app/components/registration/supporter-registration';
import { JobTypeSelection } from '@/app/components/registration/job-type-selection';
import { BasicInfoInput } from '@/app/components/registration/basic-info-input';
import { ChatPage } from '@/app/components/pages/chat-page';
import { RequestsPage } from '@/app/components/pages/requests-page';
import { ProfilePage } from '@/app/components/pages/profile-page';
import { AdminLayout } from '@/app/components/admin/admin-layout';
import { AdminDashboard } from '@/app/components/admin/dashboard';
import { ClientManagement } from '@/app/components/admin/client-management';
import { SupporterManagement } from '@/app/components/admin/supporter-management';
import { ScheduleManagement } from '@/app/components/admin/schedule-management';
import { ReportManagement } from '@/app/components/admin/report-management';
import { ApplicationManagement } from '@/app/components/admin/application-management';
import { NotificationManagement } from '@/app/components/admin/notification-management';
import { BillingManagement } from '@/app/components/admin/billing-management';
import { MatchingManagement } from '@/app/components/admin/matching-management';
import { MyJobPosting } from '@/app/components/pages/my-job-posting';
import { JobSearchPage } from '@/app/components/matching/job-search-page';
import { JobDetailModal } from '@/app/components/matching/job-detail-modal';
import { ScheduleCoordination } from '@/app/components/matching/schedule-coordination';
import { MatchingDetailPage } from '@/app/components/matching/matching-detail-page';
import { SupporterProfilePage } from '@/app/components/matching/supporter-profile-page';
import { ApplicantMessagePage } from '@/app/components/matching/applicant-message-page';
import { MenuProvider } from '@/app/contexts/menu-context';
import { BookingPage } from '@/app/components/pages/booking-page';
import { MenuPage } from '@/app/components/pages/menu-page';

export default function App() {
  const [viewMode, setViewMode] = useState<'user' | 'admin' | 'registration' | 'job-type-selection' | 'basic-info-input'>('user');
  const [userType, setUserType] = useState<'client' | 'supporter'>('client');
  const [currentPage, setCurrentPage] = useState('home');
  const [adminPage, setAdminPage] = useState('dashboard');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [showScheduleCoordination, setShowScheduleCoordination] = useState(false);
  const [matchingId, setMatchingId] = useState<number | null>(null);
  const [jobPosting, setJobPosting] = useState<any>(null); // 募集内容を保持
  const [initialJobType, setInitialJobType] = useState<'regular' | 'spot'>('regular'); // 初期のサポートタイプ
  const [basicInfo, setBasicInfo] = useState<any>(null); // 基本情報を保持
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null); // マッチング詳細用
  const [selectedSupporterId, setSelectedSupporterId] = useState<string | null>(null); // きらりさんプロフィール用

  // モック：未承認/未提出レポート数
  // 実際は、ご利用者は未承認レポート数、サポーターは未提出レポート数を表示
  const pendingReportsCount = userType === 'client' ? 1 : 2;

  // デモ用：ユーザータイプ切り替え
  const toggleUserType = () => {
    setUserType(prev => prev === 'client' ? 'supporter' : 'client');
  };

  // デモ用：表示モード切り替え
  const toggleViewMode = () => {
    if (viewMode === 'user') {
      setViewMode('admin');
      setAdminPage('dashboard');
    } else if (viewMode === 'admin') {
      setViewMode('registration');
    } else {
      setViewMode('user');
      setCurrentPage('home');
    }
  };

  const handleRegistrationComplete = () => {
    // クライアント登録完了後は、job-type-selection画面へ
    if (userType === 'client') {
      setViewMode('job-type-selection');
    } else {
      // サポーターは通常通りホームへ
      setViewMode('user');
      setCurrentPage('home');
    }
  };

  const handleJobTypeSelection = (jobType: 'regular' | 'spot') => {
    // 選択されたjobTypeを設定
    setInitialJobType(jobType);
    // 基本情報入力画面へ遷移
    setViewMode('basic-info-input');
  };

  const handleBasicInfoComplete = (info: any) => {
    // 基本情報を保存
    setBasicInfo(info);
    // 募集内容入力画面へ遷移
    setViewMode('user');
    setCurrentPage('job-posting');
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const handlePageChangeWithJobType = (page: string, jobType?: 'regular' | 'spot', jobId?: string) => {
    if (jobType) {
      setInitialJobType(jobType);
    }
    if (jobId) {
      setSelectedJobId(jobId);
    }
    handlePageChange(page);
  };

  const renderUserPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage userType={userType} onNavigate={handlePageChange} onNavigateWithJobType={handlePageChangeWithJobType} pendingReportsCount={pendingReportsCount} />;
      case 'booking':
        return <BookingPage onNavigate={handlePageChangeWithJobType} userType={userType} />;
      case 'menu':
        return <MenuPage userType={userType} onNavigate={handlePageChange} />;
      case 'job-posting':
        return (
          <MyJobPosting 
            onOpenChat={(applicantId) => console.log('Open chat:', applicantId)} 
            jobPosting={jobPosting}
            onSavePosting={setJobPosting}
            initialJobType={initialJobType}
            basicInfo={basicInfo}
            onNavigateHome={() => setCurrentPage('home')}
          />
        );
      case 'matching-detail':
        return (
          <MatchingDetailPage
            jobId={selectedJobId || '1'}
            onBack={() => setCurrentPage('booking')}
            onOpenChat={(applicantId) => {
              setSelectedSupporterId(applicantId);
              setCurrentPage('applicant-message');
            }}
            onViewProfile={(supporterId) => {
              setSelectedSupporterId(supporterId);
              setCurrentPage('supporter-profile');
            }}
          />
        );
      case 'applicant-message':
        return (
          <ApplicantMessagePage
            applicantId={selectedSupporterId || '1'}
            jobId={selectedJobId || '1'}
            onBack={() => setCurrentPage('matching-detail')}
            onViewProfile={(supporterId) => {
              setSelectedSupporterId(supporterId);
              setCurrentPage('supporter-profile');
            }}
          />
        );
      case 'supporter-profile':
        return (
          <SupporterProfilePage
            supporterId={selectedSupporterId || '1'}
            onBack={() => {
              // プロフィールから戻る時は、直前のページに応じて遷移先を変える
              // ここでは簡易的にmatching-detailに戻る
              setCurrentPage('matching-detail');
            }}
            onSendMessage={() => setCurrentPage('applicant-message')}
          />
        );
      case 'schedule':
        return <SchedulePage userType={userType} />;
      case 'chat':
        return <ChatPage userType={userType} />;
      case 'payment':
        return <PaymentPage />;
      case 'reward':
        return <RewardPage />;
      case 'requests':
        return <RequestsPage userType={userType} />;
      case 'job-search':
        return (
          <JobSearchPage
            onApply={(jobId, message) => {
              console.log('Apply to job:', jobId, message);
              alert('応募しました！');
            }}
            onViewDetail={(job) => {
              setSelectedJob(job);
              setShowJobDetail(true);
            }}
          />
        );
      case 'profile':
        return <ProfilePage userType={userType} />;
      default:
        return <HomePage userType={userType} onNavigate={handlePageChange} onNavigateWithJobType={handlePageChangeWithJobType} pendingReportsCount={pendingReportsCount} />;
    }
  };

  const renderAdminPage = () => {
    switch (adminPage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'clients':
        return <ClientManagement />;
      case 'supporters':
        return <SupporterManagement />;
      case 'matching':
        return <MatchingManagement />;
      case 'schedules':
        return <ScheduleManagement />;
      case 'reports':
        return <ReportManagement />;
      case 'applications':
        return <ApplicationManagement />;
      case 'notifications':
        return <NotificationManagement />;
      case 'billing':
        return <BillingManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="size-full">
      <MenuProvider>
      {/* デモ用の切り替えボタン */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <button
          onClick={toggleViewMode}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg text-sm hover:opacity-90 font-medium"
        >
          {viewMode === 'user' ? '🏢 運営画面へ' : viewMode === 'admin' ? '📝 登録画面へ' : '👤 ユーザー画面へ'}
        </button>
        {viewMode === 'user' && (
          <button
            onClick={toggleUserType}
            className="bg-white text-foreground border border-border px-4 py-2 rounded-full shadow-lg text-sm hover:bg-accent"
          >
            {userType === 'client' ? 'workerマイページへ' : 'userマイページへ'}
          </button>
        )}
        {viewMode === 'registration' && (
          <button
            onClick={toggleUserType}
            className="bg-white text-foreground border border-border px-4 py-2 rounded-full shadow-lg text-sm hover:bg-accent"
          >
            {userType === 'client' ? 'worker登録画面へ' : 'user登録画面へ'}
          </button>
        )}
      </div>

      {viewMode === 'registration' ? (
        userType === 'client' ? (
          <ClientRegistration onComplete={handleRegistrationComplete} />
        ) : (
          <SupporterRegistration onComplete={handleRegistrationComplete} />
        )
      ) : viewMode === 'job-type-selection' ? (
        <JobTypeSelection onComplete={handleJobTypeSelection} />
      ) : viewMode === 'basic-info-input' ? (
        <BasicInfoInput onComplete={handleBasicInfoComplete} />
      ) : viewMode === 'user' ? (
        <MobileLayout
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onPageChangeWithJobType={handlePageChangeWithJobType}
          userType={userType}
          pendingReportsCount={pendingReportsCount}
        >
          {renderUserPage()}
        </MobileLayout>
      ) : (
        <AdminLayout
          currentPage={adminPage}
          onPageChange={setAdminPage}
        >
          {renderAdminPage()}
        </AdminLayout>
      )}

      {/* お仕事詳細モーダル */}
      {showJobDetail && selectedJob && (
        <JobDetailModal
          job={selectedJob}
          userType={userType}
          onClose={() => setShowJobDetail(false)}
          onApply={(jobId, message) => {
            console.log('Apply:', jobId, message);
            setShowJobDetail(false);
            alert('応募しました！ユーザーからの承諾をお待ちください。');
          }}
        />
      )}

      {/* スケジュール調整画面 */}
      {showScheduleCoordination && matchingId && (
        <ScheduleCoordination
          matchingId={matchingId}
          userType={userType}
          onComplete={() => {
            setShowScheduleCoordination(false);
            alert('スケジュール調整が完了しました！');
          }}
        />
      )}
      </MenuProvider>
    </div>
  );
}