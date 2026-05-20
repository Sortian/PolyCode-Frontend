import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/context/AuthContext";
import { ALL_LESSONS, TOTAL_XP } from "../learn/oops-cpp/data/oopsCurriculum";
import useOopsProgress from "../learn/oops-cpp/hooks/useOopsProgress";
import {
  POINTER_LESSONS,
  POINTER_TOTAL_XP,
} from "../learn/pointers-cpp/data/pointersCurriculum";
import usePointersProgress from "../learn/pointers-cpp/hooks/usePointersProgress";

function TrackProgressCard({
  title,
  subtitle,
  lessons,
  totalXP,
  progress,
  bookmarks,
  href,
  accent,
  streak = 0,
}) {
  const completedCount = Object.keys(progress).length;
  const pct = Math.round((completedCount / lessons.length) * 100) || 0;
  const earnedXP = lessons
    .filter((lesson) => progress[lesson.id])
    .reduce((sum, lesson) => sum + lesson.xp, 0);
  const nextLesson = lessons.find((lesson) => !progress[lesson.id]) || lessons[0];

  return (
    <section className="profile-track-card" style={{ "--profile-accent": accent }}>
      <div className="profile-track-head">
        <div>
          <span>{subtitle}</span>
          <h2>{title}</h2>
        </div>
        <strong>{pct}%</strong>
      </div>

      <div className="profile-track-meter">
        <div style={{ width: `${pct}%` }} />
      </div>

      <div className="profile-track-stats">
        <div>
          <span>Lessons</span>
          <strong>
            {completedCount}/{lessons.length}
          </strong>
        </div>
        <div>
          <span>XP</span>
          <strong>
            {earnedXP}/{totalXP}
          </strong>
        </div>
        <div>
          <span>Streak</span>
          <strong>{streak} days</strong>
        </div>
        <div>
          <span>Saved</span>
          <strong>{bookmarks.length}</strong>
        </div>
      </div>

      <div className="profile-next-row">
        <div>
          <span>Next lesson</span>
          <strong>{nextLesson.title}</strong>
        </div>
        <Link to={`${href}/lesson/${nextLesson.id}`}>Continue</Link>
      </div>
    </section>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const oops = useOopsProgress();
  const pointers = usePointersProgress();
  const initials = user
    ? (user.firstName?.[0] || user.username?.[0] || "U").toUpperCase()
    : "G";
  const totalCompleted =
    Object.keys(oops.completedMap).length +
    Object.keys(pointers.completedMap).length;
  const totalLessons = ALL_LESSONS.length + POINTER_LESSONS.length;
  const totalPct = Math.round((totalCompleted / totalLessons) * 100) || 0;

  return (
    <main className="profile-page">
      <section className="profile-hero">
        <div className="profile-hero-avatar">{initials}</div>
        <div>
          <span className="profile-kicker">Learner Profile</span>
          <h1>{user?.username || "Guest learner"}</h1>
          <p>{user?.email || "Progress is saved locally on this device."}</p>
        </div>
        <div className="profile-total-progress">
          <span>Total Progress</span>
          <strong>{totalPct}%</strong>
        </div>
      </section>

      <section className="profile-overview-grid">
        <div>
          <span>Total Lessons</span>
          <strong>
            {totalCompleted}/{totalLessons}
          </strong>
        </div>
        <div>
          <span>OOPs Bookmarks</span>
          <strong>{oops.bookmarks.length}</strong>
        </div>
        <div>
          <span>Pointers Bookmarks</span>
          <strong>{pointers.bookmarks.length}</strong>
        </div>
        <div>
          <span>OOPs Streak</span>
          <strong>{oops.remoteProgress?.currentStreak || 0} days</strong>
        </div>
      </section>

      <div className="profile-track-grid">
        <TrackProgressCard
          title="OOPs C++"
          subtitle={oops.syncState === "synced" ? "Synced track" : "Learning track"}
          lessons={ALL_LESSONS}
          totalXP={TOTAL_XP}
          progress={oops.completedMap}
          bookmarks={oops.bookmarks}
          href="/learn/oops-cpp"
          accent="#b8ff00"
          streak={oops.remoteProgress?.currentStreak || 0}
        />
        <TrackProgressCard
          title="Pointers C++"
          subtitle="Memory track"
          lessons={POINTER_LESSONS}
          totalXP={POINTER_TOTAL_XP}
          progress={pointers.completedMap}
          bookmarks={pointers.bookmarks}
          href="/learn/pointers-cpp"
          accent="#00d4ff"
        />
      </div>
    </main>
  );
}
