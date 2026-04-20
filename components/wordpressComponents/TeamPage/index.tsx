'use client';

import React, { Suspense, useRef } from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import CustomBreadcrumb from '@/components/common/Breadcrumbs';
import { TeamPageProps } from 'team-page';
import FoundingMember from './FoundingMember';
import MobileHeader from '@/components/common/MobileHeader';
import dynamic from 'next/dynamic';

const LeaderMember = dynamic(() => import('./LeadershipMember'));
const ManagementMember = dynamic(() => import('./ManagementMember'));
const AdvisorAndInvestorMember = dynamic(() => import('./AdvisorAndInvestor'));
import { motion, useInView } from 'framer-motion';

const TeamPage: React.FC<TeamPageProps> = ({ template, seo }) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const breadcrumb = [
    { label: 'Home', href: '/' },
    { label: 'Team', href: '/team' },
  ];

  const foundingMember = (template as any)?.teamMembers?.founderTeamMembers;
  const leadershipMember = (template as any)?.teamMembers
    ?.leadershipTeamMembers;
  const managementMember = (template as any)?.teamMembers
    ?.managementTeamMembers;
  const advisorsAndInvestors = (template as any)?.teamMembers
    ?.advisorsAndInvestors;

  const meetTheFoundersTitle = 'Meet the Founders';
  const meetTheFoundersDescription =
    'The visionaries who started it all — blending hospitality, design, and technology to redefine how India vacations.';
  const leadershipTeamTitle = 'Leadership Team';
  const leadershipTeamDescription =
    'Steering ELIVAAS with experience, empathy, and big-picture thinking — our leadership ensures we grow with purpose and clarity.';
  const managementTeamTitle = 'Management Team';
  const managementTeamDescription =
    'The operators and problem-solvers who turn strategy into seamless execution — keeping our day-to-day running with care and precision.';
  const advisorsAndInvestorsTitle = 'Our Advisors and Investors';
  const advisorsAndInvestorsDescription =
    'Backed by believers and guided by experts — our advisors and investors help shape the future of ELIVAAS with insight, trust, and long-term vision.';

  const founderRef = useRef(null);
  const isFounderInView = useInView(founderRef, {
    once: true,
    margin: '-100px',
  });

  const leadershipRef = useRef(null);
  const isLeadershipInView = useInView(leadershipRef, {
    once: true,
    margin: '-100px',
  });

  const managementRef = useRef(null);
  const isManagementInView = useInView(managementRef, {
    once: true,
    margin: '-100px',
  });

  const advisorsRef = useRef(null);
  const isAdvisorsInView = useInView(advisorsRef, {
    once: true,
    margin: '-100px',
  });

  return (
    <>
      {!isTablet && (
        <div className='px-5 md:px-10 py-5'>
          <CustomBreadcrumb items={breadcrumb} />
        </div>
      )}

      {isTablet && <MobileHeader title='Our Team' />}

      <div className='px-5 md:px-10'>
        <div className='mt-6 md:mt-7' ref={founderRef}>
          <h2 className='text-foreground text-xl md:text-3xl font-serif'>
            {meetTheFoundersTitle}
          </h2>
          <p className='text-secondary-700 text-xs md:text-base mb-5'>
            {meetTheFoundersDescription}
          </p>
          <motion.div
            className='flex flex-col lg:flex-row gap-6'
            initial={{ opacity: 0, y: 30 }}
            animate={isFounderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            {foundingMember?.map((member?: any, index?: number) => (
              <div
                className='w-full lg:w-1/2 bg-card rounded-2xl overflow-hidden'
                key={index}
              >
                <FoundingMember
                  memberDescription={member?.memberDescription}
                  memberDesignation={member?.memberDesignation}
                  memberImage={member?.memberImage}
                  memberLinkedinUrl={member?.memberLinkedinUrl}
                  memberName={member?.memberName}
                />
              </div>
            ))}
          </motion.div>
        </div>

        <div className='mt-15' ref={leadershipRef}>
          {isTablet ? (
            <h2 className='text-foreground text-xl md:text-3xl font-serif'>
              {leadershipTeamTitle}
            </h2>
          ) : (
            <h1 className='text-foreground text-xl md:text-3xl font-serif'>
              {leadershipTeamTitle}
            </h1>
          )}

          <p className='text-secondary-700 text-xs md:text-base mb-6 mt-1'>
            {leadershipTeamDescription}
          </p>
          <motion.div
            className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-12'
            initial={{ opacity: 0, y: 30 }}
            animate={isLeadershipInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            {leadershipMember?.map((member?: any, index?: number) => (
              <div key={index}>
                <Suspense fallback={<div>Loading...</div>}>
                  <LeaderMember
                    memberDesignation={member?.memberDesignation}
                    memberImage={member?.memberImage}
                    memberName={member?.memberName}
                    memberLinkedinUrl={member?.memberLinkedinUrl}
                  />
                </Suspense>
              </div>
            ))}
          </motion.div>
        </div>

        <div className='mt-15' ref={managementRef}>
          <h2 className='text-foreground text-xl md:text-3xl font-serif'>
            {managementTeamTitle}
          </h2>
          <p className='text-secondary-700 text-xs md:text-base mb-6 mt-1'>
            {managementTeamDescription}
          </p>
          <motion.div
            className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-12'
            initial={{ opacity: 0, y: 30 }}
            animate={isManagementInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            {managementMember?.map((member?: any, index?: number) => (
              <div className='' key={index}>
                <Suspense fallback={<div>Loading...</div>}>
                  <ManagementMember
                    memberDesignation={member?.memberDesignation}
                    memberImage={member?.memberImage}
                    memberName={member?.memberName}
                    memberLinkedinUrl={member?.memberLinkedinUrl}
                  />
                </Suspense>
              </div>
            ))}
          </motion.div>
        </div>

        <div className='mt-15 mb-10' ref={advisorsRef}>
          <h2 className='text-foreground text-xl md:text-3xl font-serif'>
            {advisorsAndInvestorsTitle}
          </h2>
          <p className='text-secondary-700 text-xs md:text-base mb-6 mt-1'>
            {advisorsAndInvestorsDescription}
          </p>
          <motion.div
            className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-12'
            initial={{ opacity: 0, y: 30 }}
            animate={isAdvisorsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            {advisorsAndInvestors?.map((member?: any, index?: number) => (
              <div key={index}>
                <Suspense fallback={<div>Loading...</div>}>
                  <AdvisorAndInvestorMember
                    investorImage={member?.investorImage}
                    investorTitle={member?.investorTitle}
                    investorLinkedinUrl={member?.investorLinkedinUrl}
                  />
                </Suspense>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TeamPage;
