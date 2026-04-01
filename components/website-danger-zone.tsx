"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "@tanstack/react-form"
import { useT } from "next-i18next/client"
import { toast } from "sonner"
import { AlertTriangle, Pencil, Trash2 } from "lucide-react"
import type { Website } from "@/migrations/schema"
import { client } from "@/lib/orpc"
import { getQueryClient } from "@/lib/query-client"
import {
  intervals,
  secondsToInterval,
  updateWebsiteSchema,
} from "@/lib/schemas/website"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  website: Website
}

export default function WebsiteDangerZone({ website }: Props) {
  const { t } = useT("common")
  const router = useRouter()
  const queryClient = getQueryClient()
  const [isEditOpen, setIsEditOpen] = useState(false)

  const updateWebsite = useMutation({
    mutationFn: async (values: {
      id: string
      name: string
      url: string
      interval: (typeof intervals)[number]
    }) => client.updateWebsite(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websites"] })
      queryClient.invalidateQueries({ queryKey: ["dashboardOverview"] })
      queryClient.invalidateQueries({ queryKey: ["accountSummary"] })
      toast.success(t("websiteDangerZone.updateSuccess"))
      setIsEditOpen(false)
      router.refresh()
    },
    onError: () => {
      toast.error(t("common.somethingWentWrongTryAgain"))
    },
  })

  const deleteWebsite = useMutation({
    mutationFn: async () => client.deleteWebsite({ id: website.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websites"] })
      queryClient.invalidateQueries({ queryKey: ["dashboardOverview"] })
      queryClient.invalidateQueries({ queryKey: ["accountSummary"] })
      toast.success(t("websiteDangerZone.deleteSuccess"))
      router.push("/dashboard")
      router.refresh()
    },
    onError: () => {
      toast.error(t("common.somethingWentWrongTryAgain"))
    },
  })

  const form = useForm({
    validators: {
      onSubmit: updateWebsiteSchema,
    },
    defaultValues: {
      id: website.id,
      name: website.name,
      url: website.url,
      interval: secondsToInterval(website.intervalSeconds),
    },
    onSubmit: async ({ value }) => {
      await updateWebsite.mutateAsync(value)
    },
  })

  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-destructive/10 p-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <CardTitle>{t("websiteDangerZone.title")}</CardTitle>
            <CardDescription>
              {t("websiteDangerZone.description")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-background/80 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-medium">{t("websiteDangerZone.editTitle")}</p>
            <p className="text-sm text-muted-foreground">
              {t("websiteDangerZone.editDescription")}
            </p>
          </div>
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Pencil />
                {t("websiteDangerZone.editAction")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("websiteDangerZone.editDialogTitle")}</DialogTitle>
                <DialogDescription>
                  {t("websiteDangerZone.editDialogDescription")}
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  form.handleSubmit()
                }}
                className="space-y-4"
              >
                <FieldGroup>
                  <form.Field name="name">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            {t("addWebsite.nameLabel")}
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            type="text"
                            aria-invalid={isInvalid}
                            autoComplete="off"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      )
                    }}
                  </form.Field>

                  <form.Field name="url">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            {t("addWebsite.urlLabel")}
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            type="url"
                            aria-invalid={isInvalid}
                            autoComplete="off"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      )
                    }}
                  </form.Field>

                  <form.Field name="interval">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            {t("addWebsite.intervalLabel")}
                          </FieldLabel>
                          <Select
                            value={field.state.value}
                            onValueChange={(value) =>
                              field.handleChange(
                                value as (typeof intervals)[number]
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {intervals.map((interval) => (
                                  <SelectItem key={interval} value={interval}>
                                    {interval}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      )
                    }}
                  </form.Field>
                </FieldGroup>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditOpen(false)}
                  >
                    {t("websiteDangerZone.cancel")}
                  </Button>
                  <Button disabled={form.state.isSubmitting}>
                    {form.state.isSubmitting && <Spinner />}
                    {t("websiteDangerZone.saveAction")}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-background/80 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-medium text-destructive">
              {t("websiteDangerZone.deleteTitle")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("websiteDangerZone.deleteDescription")}
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 />
                {t("websiteDangerZone.deleteAction")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-destructive/10 text-destructive">
                  <Trash2 className="h-5 w-5" />
                </AlertDialogMedia>
                <AlertDialogTitle>
                  {t("websiteDangerZone.deleteDialogTitle")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t("websiteDangerZone.deleteDialogDescription", {
                    name: website.name,
                  })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {t("websiteDangerZone.cancel")}
                </AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => deleteWebsite.mutate()}
                  disabled={deleteWebsite.isPending}
                >
                  {deleteWebsite.isPending && <Spinner />}
                  {t("websiteDangerZone.deleteConfirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}
