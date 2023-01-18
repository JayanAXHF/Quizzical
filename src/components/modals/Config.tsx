import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useAppContext } from "../../context/context";
import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface Category {
  id: number;
  name: string;
}
interface Data {
  amount: number;
  category: string;
  difficulty: string;
}

const Config = () => {
  const {
    configIsOpen: open,
    setConfigIsOpen: setOpen,
    setUrl,
  } = useAppContext();

  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "" },
  ]);

  const fetchCategories = async () => {
    const res = await fetch("https://opentdb.com/api_category.php");
    const data = await res.json();

    setCategories(data.trivia_categories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const [data, setData] = useState<Data>({
    amount: 5,
    category: "",
    difficulty: "",
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;

    setData((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleSubmit = () => {
    const categoryId = categories
      .find((x) => x.name === data.category)
      ?.id.toString();

    if (categoryId) {
      if (data.difficulty !== "Any Difficulty") {
        setUrl(
          "https://opentdb.com/api.php?" +
            new URLSearchParams({
              amount: data.amount.toString(),
              category: categoryId || "",
              difficulty: data.difficulty,
              type: "multiple",
            })
        );
      } else {
        setUrl(
          "https://opentdb.com/api.php?" +
            new URLSearchParams({
              amount: data.amount.toString(),
              type: "multiple",
              category: categoryId || "",
            })
        );
      }
    } else {
      if (data.difficulty !== "Any Difficulty") {
        setUrl(
          "https://opentdb.com/api.php?" +
            new URLSearchParams({
              amount: data.amount.toString(),

              type: "multiple",
              difficulty: data.difficulty,
            })
        );
      } else {
        setUrl(
          "https://opentdb.com/api.php?" +
            new URLSearchParams({
              amount: data.amount.toString(),
              type: "multiple",
            })
        );
      }
    }

    handleClose();
  };

  const handleReset = () => {
    setUrl(`https://opentdb.com/api.php?amount=5&type=multiple`);
    handleClose();
  };

  return (
    <div className="grid  w-full items-center justify-between   !text-black prose-headings:prose prose-li:list-item dark:prose-headings:!text-white lg:prose-headings:prose-xl ">
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Here, you can customise your trivia
          </DialogContentText>
          <div className="w-full items-center justify-between    !text-black prose-headings:prose prose-li:list-item dark:prose-headings:!text-white lg:prose-headings:prose-xl ">
            <div>
              <br />
              <span>
                <TextField
                  value={data.amount}
                  onChange={handleChange}
                  name="amount"
                  className="w-full"
                  sx={{
                    width: "100%",
                  }}
                  label="# Questions"
                />
              </span>
            </div>
            <br />
            <div>
              <FormControl fullWidth>
                <InputLabel id="categoryLabel">Category</InputLabel>
                <Select
                  labelId="categoryLabel"
                  value={data.category}
                  label="Category"
                  onChange={handleChange}
                  defaultValue="Any Category"
                  name="category"
                >
                  <MenuItem value="Any Category">Any Category</MenuItem>
                  {categories?.map((item) => {
                    return (
                      <MenuItem value={item.name} key={item.id}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <br />

            <div>
              <FormControl fullWidth>
                <InputLabel id="difficultyLabel">Difficulty</InputLabel>
                <Select
                  labelId="difficultyLabel"
                  value={data.difficulty}
                  label="Difficulty"
                  onChange={handleChange}
                  defaultValue="Any Difficulty"
                  name="difficulty"
                >
                  <MenuItem value="Any Difficulty">Any Difficulty</MenuItem>
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button color="error" variant="outlined" onClick={handleReset}>
            Reset to default
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Config;
