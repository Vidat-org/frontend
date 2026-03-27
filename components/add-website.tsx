"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { client } from "@/lib/orpc"
import { useForm } from "@tanstack/react-form"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { toast } from "sonner"
import { Input } from "./ui/input"
import { createWebsiteSchema, intervals } from "@/lib/schemas/website"
import { Spinner } from "./ui/spinner"
import { useState } from "react"
import { getQueryClient } from "@/lib/query-client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ErrUpgradePlan } from "@/lib/errors"
import { ORPCError } from "@orpc/server"
import { t } from "@/lib/i18n"

export default function AddWebsite() {
  const { mutateAsync } = useMutation({
    mutationFn: async (values: {
      url: string
      interval: (typeof intervals)[number]
    }) => await client.createWebsite(values),
  })

  const [isFormOpen, setIsFormOpen] = useState(false)

  const form = useForm({
    validators: {
      onSubmit: createWebsiteSchema,
    },
    defaultValues: {
      url: "",
      interval: "",
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await mutateAsync({
          url: value.url,
          interval: value.interval as (typeof intervals)[number],
        })

        getQueryClient().invalidateQueries({ queryKey: ["websites"] })
        getQueryClient().invalidateQueries({ queryKey: ["dashboardOverview"] })
        getQueryClient().invalidateQueries({ queryKey: ["accountSummary"] })
        toast.success(t("addWebsite.success"))
        formApi.reset()
        setIsFormOpen(false)
      } catch (err) {
        const error = err as ORPCError<string, unknown>

        if (error.code === ErrUpgradePlan) {
          toast.error(t("addWebsite.upgradeRequired"))
          return
        }

        toast.error(t("common.somethingWentWrongTryAgain"))
      }
    },
  })

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> {t("addWebsite.cta")}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addWebsite.title")}</DialogTitle>
          <DialogDescription>{t("addWebsite.description")}</DialogDescription>
        </DialogHeader>

        <form
          id="add-website-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <FieldGroup>
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
                      placeholder={t("addWebsite.urlPlaceholder")}
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
                        field.handleChange(value as (typeof intervals)[number])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("addWebsite.intervalPlaceholder")} />
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

          <div className="flex justify-end">
            <Button disabled={form.state.isSubmitting}>
              {form.state.isSubmitting && <Spinner />}
              {t("addWebsite.submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
