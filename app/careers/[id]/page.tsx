"use client"

import React, { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/language-context';
import { jobService, JobArticle } from '@/lib/services';

// Params can be delivered as a promise in recent Next.js versions
interface RouteParams {
  id: string;
}

interface JobDetailParams {
  params: RouteParams | Promise<RouteParams>;
}

export default function JobDetailPage({ params }: JobDetailParams) {
  const { id } = use(params as any) as RouteParams;
  const { locale } = useLanguage();
  
  const [job, setJob] = useState<JobArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const detail = await jobService.detail(id, locale);
        setJob(detail as JobArticle);
      } catch (error) {
        console.error('Failed to fetch job detail', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, locale]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  if (!job) {
    notFound();
  }

  // Extract translation data (API already filtered by language, but guard just in case)
  const translation = job!.translations?.[0] ?? job!.translations?.find((t) => t.language === locale);

  const title = translation?.job_title ?? 'Untitled';
  const location = translation?.job_location ?? '';
  const department = translation?.job_position ?? '';
  const dueDate = job!.job_deadline ? new Date(job!.job_deadline).toLocaleDateString() : '';
  const descriptionHtml = translation?.job_description ?? '';
  const requirementsHtml = translation?.job_requirements ?? '';
  const benefitsHtml = translation?.job_benefits ?? '';

  // Helper to parse JSON array strings coming from backend
  const parseJsonList = (value: string | undefined): string[] => {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed))
        return parsed.map((v) =>
          String(v)
            .replace(/^[-–•\s]+/, "") // remove leading dash/bullet & spaces
            .trim()
        );
    } catch {
      // Not JSON, treat as plain string (could be paragraph)
    }
    return [value];
  };

  const descriptionList = parseJsonList(descriptionHtml);
  const requirementsList = parseJsonList(requirementsHtml);
  const benefitsList = parseJsonList(benefitsHtml);

  const introContent = translation?.content ?? "";

  return (
    <main className="min-h-screen">
      {/* Header section with job title */}
      <div className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16">
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src="/img/banner_about.png" 
            alt="Job banner"
            fill
            className="object-cover opacity-20" 
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center mb-6">
            <Link href="/careers" className="text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {locale === 'vi' ? 'Quay lại danh sách việc làm' : 
               locale === 'en' ? 'Back to job listings' : 
               '返回职位列表'}
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{title}</h1>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {location}
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {locale === 'vi' ? `Hạn nộp: ${dueDate}` : 
               locale === 'en' ? `Due date: ${dueDate}` : 
               `截止日期: ${dueDate}`}
            </div>
            <Badge variant="secondary">
              {department}
            </Badge>
            {/* Badge 'Hot' can be re-enabled when backend provides this flag */}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Job details */}
          <div className="lg:col-span-2">
            {/* Job Image */}
            {job.primary_image && (
              <div className="mb-8">
                <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src={job.primary_image} 
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="mb-6 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                <TabsTrigger value="description">
                  {locale === 'vi' ? 'Mô tả công việc' : 
                   locale === 'en' ? 'Job Description' : 
                   '职位描述'}
                </TabsTrigger>
                <TabsTrigger value="requirements">
                  {locale === 'vi' ? 'Yêu cầu' : 
                   locale === 'en' ? 'Requirements' : 
                   '要求'}
                </TabsTrigger>
                <TabsTrigger value="benefits">
                  {locale === 'vi' ? 'Phúc lợi' : 
                   locale === 'en' ? 'Benefits' : 
                   '福利'}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  {locale === 'vi' ? 'MÔ TẢ CÔNG VIỆC' : 
                   locale === 'en' ? 'JOB DESCRIPTION' : 
                   '职位描述'}
                </h2>
                <div className="space-y-6">
                  {introContent && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                      <p className="text-gray-700 leading-relaxed">{introContent}</p>
                    </div>
                  )}
                  {descriptionList.length ? (
                    <ul className="space-y-3 text-gray-700">
                      {descriptionList.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">Chưa cập nhật</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="requirements" className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  {locale === 'vi' ? 'YÊU CẦU' : 
                   locale === 'en' ? 'REQUIREMENTS' : 
                   '要求'}
                </h2>
                <div className="space-y-6">
                  {requirementsList.length ? (
                    <ul className="space-y-3 text-gray-700">
                      {requirementsList.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">Chưa cập nhật</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="benefits" className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  {locale === 'vi' ? 'PHÚC LỢI' : 
                   locale === 'en' ? 'BENEFITS' : 
                   '福利'}
                </h2>
                <ul className="space-y-4">
                  {benefitsList.length ? (
                    benefitsList.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="leading-relaxed text-gray-700">{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 italic">Chưa cập nhật</li>
                  )}
                </ul>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right column - Apply now */}
          <div>
            <Card className="sticky top-8 shadow-xl border-0 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                  {locale === 'vi' ? 'Ứng tuyển ngay' : 
                   locale === 'en' ? 'Apply Now' : 
                   '立即申请'}
                </h2>
                <p className="text-blue-100">
                  {locale === 'vi' ? 'Nắm bắt cơ hội nghề nghiệp tuyệt vời này!' : 
                   locale === 'en' ? 'Seize this great career opportunity!' : 
                   '抓住这个绝佳的职业机会！'}
                </p>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    {locale === 'vi' ? 'Gửi CV và đơn ứng tuyển của bạn đến:' :
                     locale === 'en' ? 'Send your CV and application to:' :
                     '将您的简历和申请发送至：'}
                  </p>
                  
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">Email:</span>
                    </div>
                    <p className="ml-7">hrm@chimahtt.com</p>
                    <p className="ml-7">hr@chimahtt.com</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="font-medium">
                        {locale === 'vi' ? 'Hotline:' : 
                         locale === 'en' ? 'Hotline:' : 
                         '热线：'}
                      </span>
                    </div>
                    <p className="ml-7">09.33.767.040</p>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    {locale === 'vi' ? 'Nộp đơn ngay' : 
                     locale === 'en' ? 'Apply Now' : 
                     '立即申请'}
                  </Button>
                  
                  <div className="text-center text-sm text-gray-500 mt-4 p-3 bg-gray-50 rounded-lg">
                    {locale === 'vi' ? 'Hoặc nộp hồ sơ trực tiếp tại văn phòng' : 
                     locale === 'en' ? 'Or submit your application directly at our office' : 
                     '或直接在我们的办公室提交申请'}
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="font-medium mb-2">
                    {locale === 'vi' ? 'Chia sẻ vị trí này:' : 
                     locale === 'en' ? 'Share this position:' : 
                     '分享此职位：'}
                  </h3>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                      </svg>
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                      </svg>
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-fill" viewBox="0 0 16 16">
                        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Related jobs section has been removed for now; implement later when backend supports similar queries */}
      </div>
    </main>
  );
} 