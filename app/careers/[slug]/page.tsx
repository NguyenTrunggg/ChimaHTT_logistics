"use client"

import React, { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/language-context';

interface JobDetailParams {
  params: {
    slug: string;
  };
}

export default function JobDetailPage({ params }: JobDetailParams) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const { slug } = unwrappedParams;
  const { t, locale } = useLanguage();
  
  // In a real app, this data would come from an API or CMS
  // Mock job data
  const jobData = getJobData(slug, locale);
  
  // If job not found
  if (!jobData) {
    notFound();
  }

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
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{jobData.title}</h1>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {jobData.location}
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {locale === 'vi' ? `Hạn nộp: ${jobData.dueDate}` : 
               locale === 'en' ? `Due date: ${jobData.dueDate}` : 
               `截止日期: ${jobData.dueDate}`}
            </div>
            <Badge variant="secondary">
              {jobData.department}
            </Badge>
            {jobData.isHot && (
              <Badge variant="destructive">
                {locale === 'vi' ? 'Hot' : 
                 locale === 'en' ? 'Hot' : 
                 '热门'}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Job details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="mb-6">
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
              
              <TabsContent value="description" className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">
                  {locale === 'vi' ? 'MÔ TẢ CÔNG VIỆC' : 
                   locale === 'en' ? 'JOB DESCRIPTION' : 
                   '职位描述'}
                </h2>
                <div className="space-y-4">
                  {jobData.description.map((item, index) => (
                    <div key={index}>
                      {item.title && (
                        <h3 className="font-bold mb-2">{item.title}</h3>
                      )}
                      <ul className="list-disc pl-5 space-y-2">
                        {item.points.map((point, pointIndex) => (
                          <li key={pointIndex}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="requirements" className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">
                  {locale === 'vi' ? 'YÊU CẦU' : 
                   locale === 'en' ? 'REQUIREMENTS' : 
                   '要求'}
                </h2>
                <div className="space-y-4">
                  {jobData.requirements.map((item, index) => (
                    <div key={index} className="mb-4">
                      <h3 className="font-bold mb-2">{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="benefits" className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">
                  {locale === 'vi' ? 'PHÚC LỢI' : 
                   locale === 'en' ? 'BENEFITS' : 
                   '福利'}
                </h2>
                <ul className="list-disc pl-5 space-y-3">
                  {jobData.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right column - Apply now */}
          <div>
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {locale === 'vi' ? 'Ứng tuyển ngay' : 
                   locale === 'en' ? 'Apply Now' : 
                   '立即申请'}
                </h2>
                
                <div className="space-y-4">
                  <p className="text-gray-700">
                    {locale === 'vi' ? 'Gửi CV và đơn ứng tuyển của bạn đến:' :
                     locale === 'en' ? 'Send your CV and application to:' :
                     '将您的简历和申请发送至：'}
                  </p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">Email:</span>
                    </div>
                    <p className="ml-7">hrm@chimahtt.com</p>
                    <p className="ml-7">hr@chimahtt.com</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
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
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    {locale === 'vi' ? 'Nộp đơn ngay' : 
                     locale === 'en' ? 'Apply Now' : 
                     '立即申请'}
                  </Button>
                  
                  <div className="text-center text-sm text-gray-500 mt-2">
                    {locale === 'vi' ? 'Hoặc nộp hồ sơ trực tiếp tại văn phòng' : 
                     locale === 'en' ? 'Or submit your application directly at our office' : 
                     '或直接在我们的办公室提交申请'}
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium mb-2">
                    {locale === 'vi' ? 'Chia sẻ vị trí này:' : 
                     locale === 'en' ? 'Share this position:' : 
                     '分享此职位：'}
                  </h3>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="icon" className="rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                      </svg>
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                      </svg>
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
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
        
        {/* Related jobs section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">
            {locale === 'vi' ? 'Vị trí tuyển dụng tương tự' : 
             locale === 'en' ? 'Similar Positions' : 
             '类似职位'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobData.relatedJobs.map(job => (
              <Link href={`/careers/${job.id}`} key={job.id}>
                <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2">{job.title}</h3>
                    <div className="flex items-center text-gray-600 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </div>
                    <div className="flex items-center mb-2">
                      <Badge variant="outline" className="mr-2">
                        {job.department}
                      </Badge>
                      {job.isHot && (
                        <Badge variant="destructive">
                          {locale === 'vi' ? 'Hot' : 
                           locale === 'en' ? 'Hot' : 
                           '热门'}
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-gray-500">
                        {locale === 'vi' ? `Hạn nộp: ${job.dueDate}` : 
                         locale === 'en' ? `Due date: ${job.dueDate}` : 
                         `截止日期: ${job.dueDate}`}
                      </div>
                      <Button variant="ghost" size="sm">
                        {locale === 'vi' ? 'Chi tiết' : 
                         locale === 'en' ? 'Details' : 
                         '详情'}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

// Mock function to get job data
function getJobData(slug: string, locale: string) {
  // In a real app, this would fetch data from an API or database
  const jobsData: Record<string, any> = {
    'accountant': {
      title: locale === 'vi' ? 'Nhân viên Kế toán Doanh Thu' : 
             locale === 'en' ? 'Revenue Accountant' : 
             '收入会计',
      location: locale === 'vi' ? 'Lạng Sơn' : 
                locale === 'en' ? 'Lang Son' : 
                '谅山',
      department: locale === 'vi' ? 'Kế toán' : 
                  locale === 'en' ? 'Accounting' : 
                  '会计',
      dueDate: '31/03/2024',
      isHot: true,
      description: [
        {
          title: locale === 'vi' ? 'NHIỆM VỤ CHÍNH CỦA NHÂN VIÊN KẾ TOÁN' : 
                  locale === 'en' ? 'MAIN DUTIES OF THE ACCOUNTANT' : 
                  '会计的主要职责',
          points: locale === 'vi' ? [
            'Kiểm tra và cập nhật chính xác số liệu doanh thu của doanh nghiệp hàng ngày',
            'Quản lý việc hoàn phí theo quy định. Điều chỉnh giảm công nợ',
            'Đối chiếu sổ quỹ đầu mỗi tháng của từng cơ sở',
            'Xuất hóa đơn cho khách hàng theo quy định. Quản lý hóa đơn GTGT đầu ra',
            'Lập báo cáo tình hình sử dụng hóa đơn & báo cáo doanh thu theo quý',
            'Phối hợp cùng các bộ phận khác chuẩn bị hồ sơ, chứng từ cung cấp thông tin',
            'Theo dõi công nợ khách hàng, nhân viên và đôn đốc thu hồi công nợ',
            'Ghi nhận các nghiệp vụ về doanh thu, hoàn phí vào phần mềm',
            'Lập báo cáo, in sổ sách tồn quỹ báo cáo cho ban giám đốc',
            'Lập báo cáo dự kiến thu hàng tuần, tháng',
            'Phụ trách các hợp đồng tiền gửi',
            'Đề xuất các giải pháp nâng cao hiệu quả hoạt động'
          ] : locale === 'en' ? [
            'Check and accurately update the company\'s daily revenue data',
            'Manage fee refunds according to regulations. Adjust debt reduction',
            'Reconcile the fund ledger at the beginning of each month for each facility',
            'Issue invoices to customers according to regulations. Manage output VAT invoices',
            'Prepare reports on invoice usage & quarterly revenue reports',
            'Coordinate with other departments to prepare documents and provide information',
            'Monitor customer and employee debts and urge debt collection',
            'Record revenue and fee refund transactions in software',
            'Prepare reports, print inventory books for the board of directors',
            'Prepare weekly and monthly income forecast reports',
            'Be responsible for deposit contracts',
            'Propose solutions to improve operational efficiency'
          ] : [
            '检查并准确更新公司每日收入数据',
            '按照规定管理费用退还。调整债务减少',
            '每月初核对各设施的资金账簿',
            '按规定向客户开具发票。管理增值税销项发票',
            '编制发票使用情况报告和季度收入报告',
            '与其他部门协调准备文件并提供信息',
            '监控客户和员工债务并督促债务催收',
            '在软件中记录收入和费用退还交易',
            '为董事会准备报告，打印库存账簿',
            '准备每周和每月收入预测报告',
            '负责存款合同',
            '提出改善运营效率的解决方案'
          ]
        }
      ],
      requirements: [
        {
          title: locale === 'vi' ? 'Học vấn - chuyên môn' : 
                 locale === 'en' ? 'Education - specialization' : 
                 '教育 - 专业',
          description: locale === 'vi' ? 'Tốt nghiệp Đại học chính quy trở lên chuyên ngành Kế toán, Kiểm toán, Tài chính, Ngân hàng' : 
                       locale === 'en' ? 'Graduated from university or higher in Accounting, Auditing, Finance, Banking' : 
                       '会计、审计、金融、银行等专业大学及以上学历毕业'
        },
        {
          title: locale === 'vi' ? 'Kinh nghiệm' : 
                 locale === 'en' ? 'Experience' : 
                 '经验',
          description: locale === 'vi' ? 'Có ít nhất 1 năm kinh nghiệm ở cùng vị trí hoặc tương đương' : 
                       locale === 'en' ? 'At least 1 year of experience in the same or equivalent position' : 
                       '至少1年同等职位或相当职位的工作经验'
        },
        {
          title: locale === 'vi' ? 'Năng lực / Kỹ năng' : 
                 locale === 'en' ? 'Competencies / Skills' : 
                 '能力 / 技能',
          description: locale === 'vi' ? 'Nắm vững các quy định pháp luật tài chính kế toán; Có khả năng phân tích báo cáo; Năng động, giao tiếp tốt, cẩn thận, trung thực' : 
                       locale === 'en' ? 'Master financial accounting regulations; Ability to analyze reports; Dynamic, good communication, careful, honest' : 
                       '掌握财务会计法规；能够分析报告；积极主动，沟通良好，细心，诚实'
        },
        {
          title: locale === 'vi' ? 'Ngoại ngữ' : 
                 locale === 'en' ? 'Foreign language' : 
                 '外语',
          description: locale === 'vi' ? 'Tiếng Anh/Trung, tiếng Trung là một lợi thế' : 
                       locale === 'en' ? 'English/Chinese, Chinese is an advantage' : 
                       '英语/中文，会中文是一个优势'
        }
      ],
      benefits: locale === 'vi' ? [
        'Mức lương thỏa thuận & cạnh tranh theo năng lực',
        'Chế độ bảo hiểm xã hội, y tế & bảo hiểm thất nghiệp theo quy định',
        'Cung cấp ăn ca miễn phí',
        'Thưởng lương tháng 13 theo quy định',
        'Chế độ tham gia vào các khóa đào tạo nghiệp vụ',
        'Môi trường làm việc thân thiện, năng động, cơ hội thăng tiến nhanh'
      ] : locale === 'en' ? [
        'Negotiable & competitive salary based on qualifications',
        'Social insurance, health insurance & unemployment insurance as regulated',
        'Free meal provision',
        '13th month salary bonus as regulated',
        'Participation in professional training courses',
        'Friendly, dynamic working environment, fast promotion opportunities'
      ] : [
        '根据资质提供可协商的有竞争力的薪资',
        '按规定提供社会保险、健康保险和失业保险',
        '提供免费工作餐',
        '按规定提供第13个月薪资奖金',
        '参加专业培训课程',
        '友好、积极的工作环境，快速晋升机会'
      ],
      relatedJobs: [
        {
          id: 'import-export',
          title: locale === 'vi' ? 'Nhân viên Xuất nhập khẩu' : 
                 locale === 'en' ? 'Import-Export Specialist' : 
                 '进出口专员',
          location: locale === 'vi' ? 'Lạng Sơn' : 
                    locale === 'en' ? 'Lang Son' : 
                    '谅山',
          department: locale === 'vi' ? 'Xuất nhập khẩu' : 
                      locale === 'en' ? 'Import-Export' : 
                      '进出口',
          dueDate: '29/02/2024',
          isHot: false
        },
        {
          id: 'deputy-business-director',
          title: locale === 'vi' ? 'Phó Giám đốc Kinh doanh' : 
                 locale === 'en' ? 'Deputy Business Director' : 
                 '业务副总监',
          location: locale === 'vi' ? 'Lạng Sơn' : 
                    locale === 'en' ? 'Lang Son' : 
                    '谅山',
          department: locale === 'vi' ? 'Kinh doanh' : 
                      locale === 'en' ? 'Business' : 
                      '业务',
          dueDate: '29/02/2024',
          isHot: true
        },
        {
          id: 'hr-admin',
          title: locale === 'vi' ? 'Nhân viên Hành chính Nhân sự' : 
                 locale === 'en' ? 'HR Administration Staff' : 
                 '人力资源行政人员',
          location: locale === 'vi' ? 'Lạng Sơn' : 
                    locale === 'en' ? 'Lang Son' : 
                    '谅山',
          department: locale === 'vi' ? 'Hành chính Nhân sự' : 
                      locale === 'en' ? 'HR Administration' : 
                      '人力资源行政',
          dueDate: '29/02/2024',
          isHot: false
        }
      ]
    }
    // Add more job data for other jobs as needed
  };
  
  return jobsData[slug] || null;
} 