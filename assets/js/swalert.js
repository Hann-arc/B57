document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent default link behavior
  
      const url = this.getAttribute('href'); // Get the URL from the href attribute
  
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });
  
      swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirect to the delete URL or use fetch to delete
          fetch(url, {
            method: 'DELETE'
          })
          .then(response => {
            if (response.ok) {
              swalWithBootstrapButtons.fire({
                title: "Deleted!",
                text: "Your blog has been deleted.",
                icon: "success"
              }).then(() => {
                window.location.reload(); // Reload the page after deletion
              });
            } else {
              swalWithBootstrapButtons.fire({
                title: "Error!",
                text: "Failed to delete the blog.",
                icon: "error"
              });
            }
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your blog is safe :)",
            icon: "error"
          });
        }
      });
    });
  });
  