import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faNewspaper, faClock, faArrowRight, faThumbtack } from "@fortawesome/free-solid-svg-icons"
import { useApp } from "@/lib/app-context"
import { cn } from "@/lib/utils"

const DATE = { day: "numeric", month: "long", year: "numeric" }

function Cover({ post, className }) {
  return post.cover_image ? (
    <img src={post.cover_image} alt="" loading="lazy" className={cn("w-full object-cover", className)} />
  ) : (
    <div className={cn("hero grid w-full place-items-center", className)}>
      <FontAwesomeIcon icon={faNewspaper} className="text-4xl text-white/40" />
    </div>
  )
}

function Meta({ post, L }) {
  const { num, fmtDate } = useApp()
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
      <span>{fmtDate(post.published_at, DATE)}</span>
      <span aria-hidden>·</span>
      <span>
        <FontAwesomeIcon icon={faClock} className="mr-1" />
        {L(`${post.reading_minutes} min read`, `${num(post.reading_minutes)} মিনিটে পড়া`)}
      </span>
    </p>
  )
}

export function LeadPost({ post, L }) {
  return (
    <Link to={`/blog/${post.slug}`} className="card lift group grid overflow-hidden md:grid-cols-[1.15fr_1fr]">
      <Cover post={post} className="aspect-[1.91/1] md:aspect-auto md:h-full" />
      <div className="flex flex-col justify-center p-5 md:p-8">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">{post.category_label}</span>
          {post.is_featured && (
            <span className="text-xs font-semibold text-warning">
              <FontAwesomeIcon icon={faThumbtack} className="mr-1" />
              {L("Featured", "বিশেষ")}
            </span>
          )}
        </div>
        <h2 className={cn("mt-3 text-xl leading-snug font-bold transition-colors group-hover:text-primary md:text-2xl", post.lang === "bn" && "bn")}>{post.title}</h2>
        <p className={cn("mt-2 line-clamp-3 text-sm text-muted-foreground md:text-base", post.lang === "bn" && "bn")}>{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <Meta post={post} L={L} />
          <span className="text-sm font-semibold text-primary">
            {L("Read", "পড়ুন")} <FontAwesomeIcon icon={faArrowRight} className="ml-1 text-xs transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function PostCard({ post, L }) {
  return (
    <Link to={`/blog/${post.slug}`} className="card lift group flex flex-col overflow-hidden">
      <Cover post={post} className="aspect-[1.91/1]" />
      <div className="flex flex-1 flex-col p-5">
        <span className="self-start rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">{post.category_label}</span>
        <h3 className={cn("mt-3 line-clamp-2 leading-snug font-bold transition-colors group-hover:text-primary", post.lang === "bn" && "bn")}>{post.title}</h3>
        <p className={cn("mt-1.5 line-clamp-2 text-sm text-muted-foreground", post.lang === "bn" && "bn")}>{post.excerpt}</p>
        <div className="mt-auto pt-4">
          <Meta post={post} L={L} />
        </div>
      </div>
    </Link>
  )
}
