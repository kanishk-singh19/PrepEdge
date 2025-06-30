import React from 'react'
import Image from 'next/image'
import dayjs from 'dayjs'
import { getRandomInterviewCover } from '@/lib/utils';
import { Button } from './ui/button';
import Link from 'next/link';
import DisplayTechIcons from './DisplayTechIcons';



const InterviewCard = ({interviewId, userId, role, type, techstack, createdAt}: InterviewCardProps) => {
    const feedback = null as Feedback | null;
    const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY');
  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
  <div className="card-interview relative flex flex-col gap-4 p-5">
    {/* Type Badge */}
    <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
      <p className="badge-text">{normalizedType}</p>
    </div>

    {/* Avatar + Title */}
    <div className="flex flex-col items-start gap-3">
      <Image
        src={getRandomInterviewCover()}
        alt="cover-image"
        width={90}
        height={90}
        className="rounded-full object-cover"
      />
      <h3 className="capitalize text-lg font-semibold">
        {role} Interview
      </h3>
    </div>

    {/* Date + Score */}
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Image src="/calendar.svg" alt="calendar" width={20} height={20} />
        <p className="text-sm">{formattedDate}</p>
      </div>
      <div className="flex items-center gap-2">
        <Image src="/star.svg" alt="star" width={20} height={20} />
        <p className="text-sm">{feedback?.totalScore || "---"}/100</p>
      </div>
    </div>

    {/* Feedback summary */}
    <p className="text-sm text-white/90 line-clamp-2">
      {feedback?.finalAssessment || "No feedback yet. Take it now to improve your skills."}
    </p>

    {/* Footer: Tech + Button */}
    <div className="flex items-center justify-between mt-auto pt-2">
      <DisplayTechIcons techStack={techstack} />
      <Link href={feedback ? `/interview/${interviewId}/feedback` : `/interview/${interviewId}`}>
        <Button className="btn-primary">
          {feedback ? "Check Feedback" : "View Interview"}
        </Button>
      </Link>
    </div>
  </div>
</div>

  )
}

export default InterviewCard
