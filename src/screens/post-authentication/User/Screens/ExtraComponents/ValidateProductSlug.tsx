import { Types, User } from "@adewaskar/lms-common";
import { Form, Input } from "antd";

interface ValidateProductSlugPropsI {
    product: Types.Product;
}

export default function ValidateProductSlug({ product }: ValidateProductSlugPropsI) {
    const { mutateAsync: validateSlugApi, status: validatingStatus } =
        User.Queries.useValidateSlug(product.type);
    const { data: productDetails } = User.Queries.useGetProductDetail(product)
    return <Form.Item
        name="slug"
        required
        label="Slug"
        hasFeedback
        validateStatus={
            validatingStatus === "loading" ? "validating" : "success"
        }
        rules={[
            {
                required: true,
                message: "Please enter a slug for the test",
            },
            {
                validator: async (rule, value) => {
                    console.log(productDetails?.slug, value, "112");
                    if (productDetails?.slug && productDetails?.slug !== value) {
                        try {
                            await validateSlug(value, validateSlugApi);
                            return Promise.resolve();
                        } catch (error) {
                            console.log(error);
                            return Promise.reject(error);
                        }
                    }
                },
            },
        ]}
    >
        <Input />
    </Form.Item>
}

export const validateSlug = async (slug: string, fn: (d: { slug: string }) => { exists: string }) => {
    try {
        const response = await fn({ slug });
        console.log(response, 'sssss')
        if (response.exists) {
            return Promise.reject(response.exists);
        }
    } catch (error) {
        console.error('Error checking slug:', error);
        return Promise.reject('An error occurred while checking the slug');
    }
}