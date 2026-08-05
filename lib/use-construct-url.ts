interface Props {
  key: string
}

export function useConstructUrl({ key }: Props) {

  return `${process.env.NEXT_PUBLIC_S3_BUCKET_DEVELOPMENT_URL}/${key}`

}
